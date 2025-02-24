const mongoose = require("mongoose")

const refCompanySchema = new mongoose.Schema({
    refCompanyName: {
        type: String,
        required: true
    }
}, { timestamps: true })


const RefrenceCompany = new mongoose.model("RefrenceCompany", refCompanySchema)

module.exports = RefrenceCompany