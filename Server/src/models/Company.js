const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, index: true },
    price: Number,
    marketCap: Number,
    companyName: String,
    currency: String,
    exchange: String,
    industry: String,
    website: String,
    description: String,
    ceo: String,
    sector: String,
    country: String,
    fullTimeEmployees: Number,
    isEtf: Boolean,
});

module.exports = mongoose.model("Company", CompanySchema);
