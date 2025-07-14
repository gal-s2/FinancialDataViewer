const Company = require("../models/Company");
const Grade = require("../models/Grade");
const HistoricalPrices = require("../models/HistoricalPrices");

const getCompanyByTicker = async (req, res, next) => {
    try {
        const { ticker } = req.params;
        const company = await Company.findOne({ symbol: ticker.toUpperCase() });
        if (!company) return res.status(404).json({ error: `Company with ticker: ${ticker} not found` });
        const grades = await Grade.find({ symbol: ticker.toUpperCase() });
        const historicalPrices = await HistoricalPrices.find({ symbol: ticker.toUpperCase() });
        res.status(200).json({ company, grades, historicalPrices });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCompanyByTicker,
};
