const pool = require("../../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");
const styleQueries = require("../styles/queries");
// Create a Checkout (POST Request)
const createCheckout = async (req, res) => {
  try {
    const { customer_email, qr_single_id, checkout_date, style_id } = req.body;

    const newCheckout = await pool.query(queries.createCheckout, [
      customer_email,
      qr_single_id,
      checkout_date,
    ]);

    pool.query(styleQueries.singleDecreaseInventory, [style_id]);

    await pool.query();

    res.status(201).json(newCheckout.rows[0]);
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Unable to create checkout" });
  }
};

// Get all Checkouts (GET Request)
const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await pool.query(queries.getAllCheckouts);
    res.status(200).json(checkouts.rows);
  } catch (error) {
    console.error("Error getting checkouts:", error);
    res.status(500).json({ error: "Unable to get checkouts" });
  }
};

const getAllCheckoutsWithStyles = async (req, res) => {
  try {
    const checkouts = await pool.query(queries.getAllCheckoutsWithStyles);
    res.status(200).json(checkouts.rows);
  } catch (error) {
    console.error("Error getting all checkouts with styles:", error);
    res.status(500).json({ error: "Unable to get all checkouts with styles" });
  }
};

const getCurrentCheckouts = async (req, res) => {
  try {
    const checkouts = await pool.query(queries.getCurrentCheckouts);
    res.status(200).json(checkouts.rows[0].count);
  } catch (error) {
    console.error("Error getting all checkouts with styles:", error);
    res.status(500).json({ error: "Unable to get all checkouts with styles" });
  }
};

const getCheckoutByQR = async (req, res) => {
  try {
    const qrSingleId = req.params.id;
    const checkout = await pool.query(queries.getCheckoutByQR, [qrSingleId]);

    if (checkout.rowCount === 0) {
      res.status(404).json({ error: "Checkout not found" });
      return;
    }

    res.status(200).json(checkout.rows[0]);
  } catch (error) {
    console.error("Error getting checkout by ID:", error);
    res.status(500).json({ error: "Unable to get checkout" });
  }
};

// Get Checkout by ID (GET Request)
const getCheckoutById = async (req, res) => {
  try {
    const checkoutId = req.params.id;
    const checkout = await pool.query(queries.getCheckoutById, [checkoutId]);

    if (checkout.rowCount === 0) {
      res.status(404).json({ error: "Checkout not found" });
      return;
    }

    res.status(200).json(checkout.rows[0]);
  } catch (error) {
    console.error("Error getting checkout by ID:", error);
    res.status(500).json({ error: "Unable to get checkout" });
  }
};

// Update Checkout by ID (PUT Request)
const updateCheckoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin_date } = req.body;

    const updatedCheckout = await pool.query(queries.updateCheckoutById, [
      checkin_date,
      id,
    ]);

    if (updatedCheckout.rowCount === 0) {
      res.status(404).json({ error: "Checkout not found" });
      return;
    }

    res.status(200).json(updatedCheckout.rows[0]);
  } catch (error) {
    console.error("Error updating checkout by ID:", error);
    res.status(500).json({ error: "Unable to update checkout" });
  }
};

// Delete Checkout by ID (DELETE Request)
const deleteCheckoutById = async (req, res) => {
  try {
    const checkoutId = req.params.id;
    const deletedCheckout = await pool.query(queries.deleteCheckoutById, [
      checkoutId,
    ]);

    if (deletedCheckout.rowCount === 0) {
      res.status(404).json({ error: "Checkout not found" });
      return;
    }

    res.status(200).json(deletedCheckout.rows[0]);
  } catch (error) {
    console.error("Error deleting checkout by ID:", error);
    res.status(500).json({ error: "Unable to delete checkout" });
  }
};

module.exports = {
  createCheckout,
  getAllCheckouts,
  getCheckoutById,
  getCheckoutByQR,
  updateCheckoutById,
  deleteCheckoutById,
  getAllCheckoutsWithStyles,
  getCurrentCheckouts,
};
