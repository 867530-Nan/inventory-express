const express = require("express");
const router = express.Router();
const styleController = require("./controller");

// Create a new style
router.post("/", styleController.createStyle);

// Get all styles
router.get("/", styleController.getAllStyles);

router.get("/low-inventory", styleController.getLowInventoryStyles);

router.put(
  "/single-decrease-inventory/:id",
  styleController.singleDecreaseInventory,
);

router.get("/get-style-info/:id", styleController.getInfoRelativeToStyle);

router.get("/dashboard-info", styleController.getDashboardInfo);

// Get a style by ID
router.get("/:id", styleController.getStyleById);

// Update a style by ID
router.put("/:id", styleController.updateStyle);

// Delete a style by ID
router.delete("/:id", styleController.deleteStyle);

module.exports = router;
