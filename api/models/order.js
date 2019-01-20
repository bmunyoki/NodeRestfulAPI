const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    quantity: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Order', orderSchema);