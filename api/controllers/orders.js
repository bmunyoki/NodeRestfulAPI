const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id product status quantity total')
        .populate('product', 'name price')
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
    
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity,
                total: req.body.total
            });

            order.save()
                .then(result => {
                    res.status(201).json({
                        message: 'New order created',
                        order: result
                    })
                });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating new order',
                error: err
            })
        });
}

exports.orders_get_one_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('_id product_id status total')
        .populate('product')
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
}

exports.orders_update_order = (req, res, next) => {
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
}
exports.orders_delete_order = (req, res, next) => {
    Order.findByIdAndRemove({_id: req.params.orderId})
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
}