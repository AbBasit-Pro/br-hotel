const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");

// GET /api/report/:reservationId
router.get("/:reservationId", generateReport);

module.exports = router;
