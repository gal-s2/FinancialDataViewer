const axios = require("axios");
const csv = require("csv-parser");
const cron = require("node-cron");

const BASE_URL = "https://financialmodelingprep.com/stable";
const PROFILE_URL = `${BASE_URL}/profile-bulk?part=0`;
const GRADES_URL = `${BASE_URL}/grades`;
const PRICES_URL = `${BASE_URL}/historical-price-eod/full`;
const formatDate = (date) => date.toISOString().split("T")[0];

const Company = require("../models/Company");
const Grade = require("../models/Grade");
const HistoricalPrices = require("../models/HistoricalPrices");

// Schedule the data updater to run daily at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        await dataUpdater();
        console.log("Daily data update completed.");
    } catch (err) {
        console.error("Daily data update failed:", err.message);
    }
});

// Fetch company data from the API
async function fetchCompanyData() {
    try {
        const response = await axios.get(PROFILE_URL, {
            params: {
                apikey: process.env.API_KEY,
            },
            responseType: "stream",
        });

        const results = [];

        // Parse the CSV data from the response
        await new Promise((resolve, reject) => {
            response.data
                .pipe(csv())
                .on("data", (row) => {
                    const marketCap = parseFloat(row.marketCap);
                    const price = parseFloat(row.price);
                    const isEtf = row.isEtf === "true";
                    const filter = marketCap > 60000000000 && !isEtf && price > 0.01 && ["NASDAQ", "NYSE"].includes(row.exchange);
                    if (filter) results.push(row);
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Prepare operations for bulk write
        const operations = results.map((company) => ({
            updateOne: {
                filter: { symbol: company.symbol },
                update: { $set: company },
                upsert: true,
            },
        }));

        // Update or insert companies
        if (operations.length > 0) {
            const bulkWriteResult = await Company.bulkWrite(operations);
            console.log(`Upserted ${bulkWriteResult.upsertedCount} and modified ${bulkWriteResult.modifiedCount} companies.`);
        }

        return results;
    } catch (error) {
        console.error("Error fetching company data:", error.message);
        //throw error; // Re-throw the error to be handled by the caller
    }
}

// Fetch grades data for companies
async function fetchGradesData(companiesData) {
    try {
        if (!companiesData || companiesData.length === 0) {
            console.log("No company data given, skipping grades updates.");
            return;
        }

        const operations = [];

        for (const company of companiesData) {
            const ticker = company.symbol;
            try {
                const response = await axios.get(GRADES_URL, {
                    params: {
                        symbol: ticker,
                        apikey: process.env.API_KEY,
                    },
                });

                const grades = response.data;
                if (!Array.isArray(grades) || grades.length === 0) continue; // Skip if no grades data is returned

                // Prepare operations for bulk write
                grades.forEach((grade) => {
                    operations.push({
                        updateOne: {
                            filter: {
                                symbol: grade.symbol,
                                date: grade.date,
                                gradingCompany: grade.gradingCompany,
                            },
                            update: { $set: grade },
                            upsert: true,
                        },
                    });
                });
            } catch (error) {
                console.error(`Error fetching grades for ${ticker}:`, error.message);
            }
        }

        // Update or insert grades
        if (operations.length > 0) {
            const bulkWriteResult = await Grade.bulkWrite(operations);
            console.log(`Upserted ${bulkWriteResult.upsertedCount} and modified ${bulkWriteResult.modifiedCount} grades.`);
        }
    } catch (error) {
        console.error(`Error fetching grades:`, error.message);
    }
}

// Fetch historical price data for the last two years
async function fetchHistoricalPriceData(companiesData) {
    try {
        if (!companiesData || companiesData.length === 0) {
            console.log("No company data given, skipping historical prices updates.");
            return;
        }

        const today = new Date();
        const allPrices = [];

        for (const company of companiesData) {
            const ticker = company.symbol;
            try {
                // Check when the last record was added to the database and update only the neccessary data
                const lastRecord = await HistoricalPrices.findOne({ symbol: ticker }).sort({ date: -1 });
                let fromDate = new Date(today);
                if (lastRecord) {
                    fromDate = new Date(lastRecord.date);
                    fromDate.setDate(fromDate.getDate() + 1);
                } else {
                    fromDate.setFullYear(today.getFullYear() - 2); // set from to 2 years ago
                }

                const from = formatDate(fromDate);
                const to = formatDate(today);

                if (new Date(from) > today) continue; // No new data needed for current company, already up to date.

                const response = await axios.get(PRICES_URL, {
                    params: {
                        symbol: ticker,
                        from: from,
                        to: to,
                        apikey: process.env.API_KEY,
                    },
                });

                // add the fetched historical prices to the future update array
                const historicalPrices = response.data;
                if (Array.isArray(historicalPrices) && historicalPrices.length > 0) {
                    allPrices.push(...historicalPrices);
                }
            } catch (error) {
                console.error(`Error fetching historical price data for ${ticker}:`, error.message);
            }
        }

        // Prepare operations for bulk write
        const operations = allPrices.map((price) => ({
            updateOne: {
                filter: { symbol: price.symbol, date: price.date },
                update: { $set: price },
                upsert: true,
            },
        }));

        // Update or insert historical prices
        if (operations.length > 0) {
            const bulkWriteResult = await HistoricalPrices.bulkWrite(operations);
            console.log(`Upserted ${bulkWriteResult.upsertedCount} and modified ${bulkWriteResult.modifiedCount} historical prices.`);
        }

        // Remove historical prices older than two years
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);
        await HistoricalPrices.deleteMany({
            date: { $lt: new Date(twoYearsAgo) },
        });
    } catch (error) {
        console.error("Error fetching historical prices data:", error.message);
    }
}

// Update function to fetch and update all data
async function dataUpdater() {
    try {
        const companiesData = await fetchCompanyData();
        await fetchGradesData(companiesData);
        await fetchHistoricalPriceData(companiesData);
        console.log("Data update completed successfully.");
    } catch (error) {
        console.error("Error while fetching data:", error.message);
    }
}

module.exports = dataUpdater;
