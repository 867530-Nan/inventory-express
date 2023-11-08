const pool = require("../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");

// Create a Customer (POST Request)
const createCustomer = async (req, res) => {
  try {
    const { name, email, address, phone_number } = req.body;

    const newCustomer = await pool.query(queries.newCustomer, [
      name,
      email,
      address,
      phone_number,
    ]);

    res.status(201).json(newCustomer.rows[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Unable to create customer" });
  }
};

// Get all Customers (GET Request)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await pool.query(queries.getAllCustomers);
    console.log("congras on the customres", customers);
    res.status(200).json(customers.rows);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ error: "Unable to get customers" });
  }
};

// Get Customer by ID (GET Request)
const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await pool.query(queries.getCustomerById, [customerId]);
    if (customer.rowCount === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.status(200).json(customer.rows[0]);
  } catch (error) {
    console.error("Error getting customer by ID:", error);
    res.status(500).json({ error: "Unable to get customer" });
  }
};

// Update Customer by ID (PUT Request)
const updateCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, email, address, phone_number } = req.body;

    const updatedCustomer = await pool.query(queries.updateCustomerById, [
      name,
      email,
      address,
      phone_number,
      customerId,
    ]);

    if (updatedCustomer.rowCount === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(updatedCustomer.rows[0]);
  } catch (error) {
    console.error("Error updating customer by ID:", error);
    res.status(500).json({ error: "Unable to update customer" });
  }
};

const deleteCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;

    const deletedCustomer = await pool.query(queries.deleteCustomer, [
      customerId,
    ]);

    if (deletedCustomer.rowCount === 0) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    res.status(200).json(deletedCustomer.rows[0]);
  } catch (error) {
    console.error("Error deleting customer by ID:", error);
    res.status(500).json({ error: "Unable to delete customer" });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
};
