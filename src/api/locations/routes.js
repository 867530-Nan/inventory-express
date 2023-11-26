const express = require("express");
const router = express.Router();
const locationsController = require("./controller");

// Create a Location (POST Request)
router.post("/", locationsController.createLocation);

// Get all Locations (GET Request)
router.get("/", locationsController.getAllLocations);

// Get Location by ID (GET Request)
router.get("/:id", locationsController.getLocationById);

// Update Location by ID (PUT Request)
router.put("/:id", locationsController.updateLocationById);

// Delete Location by ID (DELETE Request)
router.delete("/:id", locationsController.deleteLocationById);

module.exports = router;
