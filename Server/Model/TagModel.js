const mongoose = require("mongoose")

const TagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true
    },
    tagColor: {
        type: String,
        required: true
    }
})

const Tag = mongoose.model("TagModel", TagSchema)

module.exports = Tag