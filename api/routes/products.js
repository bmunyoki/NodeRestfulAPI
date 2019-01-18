const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');

const router = express.Router();

// Ger all products
router.get('/', (req, res, next) => {
    Product.find().find()
        .select("_id sku name price created_at updated_at")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        sku: doc.sku,
                        name: doc.name,
                        price: doc.price,
                        created_at: doc.created_at,
                        updated_at: doc.updated_at,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };

            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Create a new product
router.post('/', (req, res, next) => {
    //Check if another product exists with the same SKU
    Product.find({sku: req.body.sku})
        .exec()
        .then(doc => {
            if(doc.length > 0){
                return res.status(404).json({
                    message: "Product SKU already exists!"
                });
            }else{
                const product = new Product({
                    _id: new mongoose.Types.ObjectId(),
                    sku: req.body.sku,
                    name: req.body.name,
                    price: req.body.price
                });

                product.save().then(result => {
                    res.status(200).json({
                        message: 'Product created succesfully',
                        product: {
                            name: result.name,
                            price: result.price,
                            _id: result._id,
                            created_at: result.created_at,
                            updated_at: result.updated_at
                        }
                    });
                });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

// Get a single product
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
        .exec()
        .then(product => {
            if(product){
                res.status(200).json(product);
            }else{
                res.status(404).json({message: 'Product not found'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err.message});
        })
});

// Update a product
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.findOneAndUpdate({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(200).json({
                error: err
            });
        })
});

// Delete product
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findOneAndRemove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: {sku: "String", name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;