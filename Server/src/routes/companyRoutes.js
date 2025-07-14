const { getCompanyByTicker } = require("../controllers/companyController");

const router = require("express").Router();

router.get("/:ticker", getCompanyByTicker);

module.exports = router;
