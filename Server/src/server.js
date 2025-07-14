const express = require("express");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

app.use("/api", require("./routes/router"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
