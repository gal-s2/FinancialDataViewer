const app = require("./src/server");
require("dotenv").config({ quiet: true });
const PORT = process.env.PORT || 8000;

const connectDB = require("./src/config/mongo");
const dataUpdater = require("./src/services/dataUpdater");

const startServer = async () => {
    try {
        await connectDB();
        await dataUpdater();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error in server start", error.message);
        process.exit(1);
    }
};

startServer();
