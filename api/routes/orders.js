const express = require('express');

const router = express.Router();

const OrderController = require('../controllers/orders');

//Ger all orders
router.get('/', OrderController.orders_get_all_orders);

//Create an order
router.post('/', OrderController.orders_create_order);

// Get a single order
router.get('/:orderId', OrderController.orders_get_one_order);

// Update and order
router.patch('/:orderId', OrderController.orders_update_order);

// Delete an order
router.delete('/:orderId', OrderController.orders_delete_order);

module.exports = router;