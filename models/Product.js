const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    categorie: {
        type: Array,
    },
    size: {
        type: String,
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

exports.productSchema = productSchema;
exports.Product = Product; 