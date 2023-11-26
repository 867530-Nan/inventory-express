const express = require("express");
const router = express.Router();

const customersController = require("./controller");

// Get all Customers (GET Request)
router.post("/like-search", customersController.getCustomersLikeSearch);
router.get("/", customersController.getAllCustomers);
// Create a Customer (POST Request)
router.post("/", customersController.createCustomer);

// Get Customer by ID (GET Request)
router.get("/:id", customersController.getCustomerById);

// Update Customer by ID (PUT Request)
router.put("/:id", customersController.updateCustomerById);

// Delete Customer by ID (DELETE Request)
router.delete("/:id", customersController.deleteCustomerById);

module.exports = router;
