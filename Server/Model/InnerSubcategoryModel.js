const mongoose = require("mongoose")

const InnerSubcategorySchema = new mongoose.Schema({
    categoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Main-Category",
        required: true
    },
    subcategoryName: {
        type: mongoose.Schema.ObjectId,
        ref: "Subcategory",
        required: true
    },
    innerSubcategoryName: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    innersubcategoryStatus: {
        type: String,
        default: "False"
    }
})

const InnerSubcategory = mongoose.model("InnerSubcategory", InnerSubcategorySchema)

module.exports = InnerSubcategory