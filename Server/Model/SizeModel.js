const mongoose = require("mongoose")

const SizeSchema = new mongoose.Schema({
    sizeweight: {
        type: String,
        required: true
    },
    sizeStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })

const Size = mongoose.model("Size", SizeSchema)

module.exports = Size