const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)

exports.cartSchema = cartSchema;
exports.Cart = Cart; 