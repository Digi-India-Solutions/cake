const mongoose = require("mongoose")

const MainCategorySchema = new mongoose.Schema({
    mainCategoryName: {
        type: String,
        required: true
    },
    subcategoryExit: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const MainCategory = mongoose.model("Main-Category", MainCategorySchema)

module.exports = MainCategory