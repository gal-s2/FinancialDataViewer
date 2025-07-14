const router = require("express").Router();
const companyRoutes = require("./companyRoutes");

router.use("/companies", companyRoutes);

module.exports = router;
