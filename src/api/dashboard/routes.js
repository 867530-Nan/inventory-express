const express = require("express");
const router = express.Router();
const dashboardController = require("./controller");

router.get("/most-popular-styles", dashboardController.getMostPopularStyle);

router.get(
  "/zero-inventory-styles",
  dashboardController.getZeroInventoryStyles,
);

router.get(
  "/checked-out-samples",
  dashboardController.getNumberOfCheckedOutSamples,
);

module.exports = router;
