const mongoose = require("mongoose");

const HistoricalPricesSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number,
});

HistoricalPricesSchema.index({ symbol: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("HistoricalPrices", HistoricalPricesSchema);
