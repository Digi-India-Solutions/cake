const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: true
    },
    bannerType: {
        type: String,
        required: true
    },
    bannerStatus: {
        type: String,
        default: "False"
    }
}, { timestamps: true })


const Banner = mongoose.model("Banner", bannerSchema)

module.exports = Banner