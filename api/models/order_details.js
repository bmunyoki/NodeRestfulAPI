const mongoose = require('mongoose');

const orderDetailsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
    ,
    sub_total: {
        type: Number,
        required: true
    }
    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('OrderDetails', orderDetailsSchema);