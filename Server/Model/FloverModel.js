const mongoose = require("mongoose")

const FloverSchema = new mongoose.Schema({
    floverName: {
        type: String,
        required: true
    },
    floverStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })

const Flover = mongoose.model("Flover", FloverSchema)

module.exports = Flover