const pool = require("../../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");
const styleQueries = require("../styles/queries");
// Create a Order (POST Request)
const createOrder = async (req, res) => {
  try {
    const { customer_email, qr_single_id, order_date, style_id } = req.body;

    const newOrder = await pool.query(queries.createOrder, [
      customer_email,
      qr_single_id,
      order_date,
    ]);

    pool.query(styleQueries.singleDecreaseInventory, [style_id]);

    await pool.query();

    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Unable to create order" });
  }
};

// Get all Orders (GET Request)
const getAllOrders = async (req, res) => {
  try {
    const orders = await pool.query(queries.getAllOrders);
    res.status(200).json(orders.rows);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Unable to get orders" });
  }
};

const getAllOrdersWithStyles = async (req, res) => {
  try {
    const orders = await pool.query(queries.getAllOrdersWithStyles);
    res.status(200).json(orders.rows);
  } catch (error) {
    console.error("Error getting all orders with styles:", error);
    res.status(500).json({ error: "Unable to get all orders with styles" });
  }
};

const getCurrentOrders = async (req, res) => {
  try {
    const orders = await pool.query(queries.getCurrentOrders);
    res.status(200).json(orders.rows[0].count);
  } catch (error) {
    console.error("Error getting all orders with styles:", error);
    res.status(500).json({ error: "Unable to get all orders with styles" });
  }
};

const getOrderByQR = async (req, res) => {
  try {
    const qrSingleId = req.params.id;
    const order = await pool.query(queries.getOrderByQR, [qrSingleId]);

    if (order.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order.rows[0]);
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(500).json({ error: "Unable to get order" });
  }
};

// Get Order by ID (GET Request)
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await pool.query(queries.getOrderById, [orderId]);

    if (order.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order.rows[0]);
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(500).json({ error: "Unable to get order" });
  }
};

// Update Order by ID (PUT Request)
const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkin_date } = req.body;

    const updatedOrder = await pool.query(queries.updateOrderById, [
      checkin_date,
      id,
    ]);

    if (updatedOrder.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(updatedOrder.rows[0]);
  } catch (error) {
    console.error("Error updating order by ID:", error);
    res.status(500).json({ error: "Unable to update order" });
  }
};

// Delete Order by ID (DELETE Request)
const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await pool.query(queries.deleteOrderById, [orderId]);

    if (deletedOrder.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(deletedOrder.rows[0]);
  } catch (error) {
    console.error("Error deleting order by ID:", error);
    res.status(500).json({ error: "Unable to delete order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByQR,
  updateOrderById,
  deleteOrderById,
  getAllOrdersWithStyles,
  getCurrentOrders,
};
