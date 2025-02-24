const mongoose = require("mongoose")

const ColorSchema = new mongoose.Schema({
    colorName: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    colorStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })


const Color = mongoose.model("Color", ColorSchema)

module.exports = Color