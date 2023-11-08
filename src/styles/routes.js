const express = require("express");
const router = express.Router();
const styleController = require("./controller");

// Create a new style
router.post("/", styleController.createStyle);

// Get all styles
router.get("/", styleController.getAllStyles);

router.get("/low-inventory", styleController.getLowInventoryStyles);

// Get a style by ID
router.get("/:id", styleController.getStyleById);

// Update a style by ID
router.put("/:id", styleController.updateStyle);

// Delete a style by ID
router.delete("/:id", styleController.deleteStyle);

module.exports = router;
