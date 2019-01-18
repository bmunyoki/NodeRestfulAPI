const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

//Ger all orders
router.get('/', (req, res, next) => {
    Order.find()
        .select('_id product_id quantity status')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    
});

//Create an order
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product_id: req.body.productId,
                quantity: req.body.quantity
            });

            order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'New order created',
                        order: result
                    })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error creating new order',
                error: err
            })
        });
});

// Get a single order
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product_id quantity status')
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    error: 'Order not found'
                });
            }

            res.status(200).json({
                order: order
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Update and order
router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Order.findOneAndUpdate({_id: id}, { $set: updateOps })
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

// Delete an order
router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;