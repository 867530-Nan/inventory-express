const express = require("express");
const router = express.Router();
const checkoutsController = require("./controller");

// Create a Checkout (POST Request)
router.post("/", checkoutsController.createCheckout);

// Get all Checkouts (GET Request)
router.get("/", checkoutsController.getAllCheckouts);

router.get("/all-with-styles", checkoutsController.getAllCheckoutsWithStyles);

router.get("/checkout-counts", checkoutsController.getCurrentCheckouts);

// Get Checkout by ID (GET Request)
router.get("/:id", checkoutsController.getCheckoutById);

// Update Checkout by ID (PUT Request)
router.put("/:id", checkoutsController.updateCheckoutById);

// Delete Checkout by ID (DELETE Request)
router.delete("/:id", checkoutsController.deleteCheckoutById);

router.get("/qr-check/:id", checkoutsController.getCheckoutByQR);

module.exports = router;
