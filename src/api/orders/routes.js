const express = require("express");
const router = express.Router();
const ordersController = require("./controller");

// Create a Order (POST Request)
router.post("/", ordersController.createOrder);

// Get all Orders (GET Request)
router.get("/", ordersController.getAllOrders);

router.get("/all-with-styles", ordersController.getAllOrdersWithStyles);

router.get("/order-counts", ordersController.getCurrentOrders);

// Get Order by ID (GET Request)
router.get("/:id", ordersController.getOrderById);

// Update Order by ID (PUT Request)
router.put("/:id", ordersController.updateOrderById);

// Delete Order by ID (DELETE Request)
router.delete("/:id", ordersController.deleteOrderById);

router.get("/qr-check/:id", ordersController.getOrderByQR);

module.exports = router;
