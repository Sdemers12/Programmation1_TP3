const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    code: String,
    description: String,
    prix: Number,
});

module.exports = mongoose.model("Product", productSchema);