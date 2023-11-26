const express = require("express");
const router = express.Router();
const qrSinglesController = require("./controller");

// Create a new QR single
router.post("/", qrSinglesController.createQrSingle);

// get all by style
router.get("/by-style/:id", qrSinglesController.getAllQrsByStyle);

// Get all QR singles
router.get("/", qrSinglesController.getAllQrSingles);

// Get a QR single by ID
router.get("/:id", qrSinglesController.getQrSingleById);

router.get(
  "/:id/style-and-checkouts",
  qrSinglesController.getQRStyleAndCheckout,
);

// Update a QR single by ID
router.put("/:id", qrSinglesController.updateQrSingle);

// Delete a QR single by ID
router.delete("/:id", qrSinglesController.deleteQrSingle);

module.exports = router;
