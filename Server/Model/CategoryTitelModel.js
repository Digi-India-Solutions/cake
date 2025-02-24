const mongoose = require("mongoose")

const CategoryTitelSchema = new mongoose.Schema({
    titelName: {
        type: String,
        required: true
    },
    titelImage: {
        type: String,
        required: true
    },
    categories: {
        type: [mongoose.Schema.ObjectId],
        required: true
    }
})

const CategoryTitel = mongoose.model("CategoryTitel", CategoryTitelSchema)

module.exports = CategoryTitel