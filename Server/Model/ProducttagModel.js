const mongoose = require("mongoose")

const priceRangeSchema = new mongoose.Schema({
    priceRangeImage: {
        type: String,
        required: true
    },
    priceMinimum: {
        type: String,
        required: true
    }
    ,
    priceMaximum: {
        type: String,
        required: true
    }
})

const ProducttageModel = new mongoose.Schema({
    tagHeading: {
        type: String,
        required: true
    },
    sortDescription: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    multipulProduct: {
        type: [mongoose.Schema.ObjectId],
        ref: "Product",
        required: true
    },
    priceRange: {
        type: [priceRangeSchema]
    }
})


const ProductTag = mongoose.model("ProductTag", ProducttageModel)

module.exports = ProductTag