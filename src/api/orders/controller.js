const pool = require("../../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");
const orderQueries = require("../orders/queries");
const customerQueries = require("../customers/queries");
const qrQueries = require("../qrSingles/queries");
const styleQueries = require("../styles/queries");

// Create a Order (POST Request)
const createOrder = async (req, res) => {
  try {
    const {
      customer: { name, address, phoneNumber, email },
      qr_code_ids,
    } = req.body;

    // create the customer if doesn't already exist
    const customer = await pool.query(
      customerQueries.createCustomerIfEmailDoesntExist,
      [name, address, phoneNumber, email],
    );

    // create an order
    const order = await pool.query(orderQueries.createOrder, [
      customer.rows[0].id,
    ]);

    const queryText = `
    INSERT INTO order_qr_code_relations (order_id, qr_single_id)
    VALUES ${qr_code_ids
      .map((code, index) => `(${order.rows[0].id}, ${code})`)
      .join(", ")};`;

    // insert the associations of order and qr_single_id
    await pool.query(queryText);
    // update the inventory to reflect checking out the sample
    await pool.query(styleQueries.decreaseStyleInventoryByOneViaQrID, [
      qr_code_ids,
    ]);
    // get the updated style and qr_code information
    const codesAndStyles = await pool.query(
      qrQueries.getBulkStylesFromQRCodes,
      [qr_code_ids],
    );

    res.status(200).json({
      customer: customer.rows[0],
      order: order.rows[0],
      codesAndStyles: codesAndStyles.rows,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Unable to create order" });
  }
};

const updateEntireOrder = async (req, res) => {
  try {
    const {
      orderId, // Assuming you have an orderId to identify the order to update
      customer: { name, address, phoneNumber, email },
      qr_code_ids,
    } = req.body;

    // Update the customer information
    const updatedCustomer = await pool.query(
      customerQueries.updateCustomerByOrderId,
      [name, email, address, phoneNumber, orderId],
    );

    const deleteOriginalQRs = `
      Delete from order_qr_code_relations where order_id = $1
    `;

    const updatedOrder = await pool.query(orderQueries.getOrderById, [orderId]);

    // Delete existing associations
    await pool.query(deleteOriginalQRs, [orderId]);

    // add back to inventory the deleted associations
    await pool.query(styleQueries.increaseStyleInventoryByOneViaQrID, [
      qr_code_ids,
    ]);

    // Insert new associations
    const queryText = `
      INSERT INTO order_qr_code_relations (order_id, qr_single_id)
      VALUES ${qr_code_ids.map((code) => `(${orderId}, ${code})`).join(", ")};`;
    console.log("the query tet", queryText);
    await pool.query(queryText);

    // Update the inventory to reflect the updated samples
    await pool.query(styleQueries.decreaseStyleInventoryByOneViaQrID, [
      qr_code_ids,
    ]);

    // Get the updated style and qr_code information
    const codesAndStyles = await pool.query(
      qrQueries.getBulkStylesFromQRCodes,
      [qr_code_ids],
    );

    res.status(200).json({
      customer: updatedCustomer.rows[0],
      order: updatedOrder.rows[0],
      codesAndStyles: codesAndStyles.rows,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Unable to update order" });
  }
};

// Get all Orders (GET Request)
const getOrdersDashboardInfo = async (req, res) => {
  try {
    const orders = await pool.query(queries.getOrdersDashboardInfo);
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
const getOrderCustomerStylesById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await pool.query(queries.getOrderCustomerStylesById, [
      orderId,
    ]);

    if (order.rowCount === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_address,
      customer_phone_number,
      order_id,
      checkout_date,
      checkin_date,
      qr_code_styles,
    } = order.rows[0];
    res.status(200).json({
      customer: {
        id: customer_id,
        name: customer_name,
        email: customer_email,
        address: customer_address,
        phone_number: customer_phone_number,
      },
      order: {
        id: order_id,
        checkout_date: checkout_date,
        checkin_date: checkin_date,
      },
      codesAndStyles: qr_code_styles,
    });
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

const checkInOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await pool.query(queries.checkInOrder, [orderId]);

    res.status(204).end();
  } catch (error) {
    console.error("Error checking in order:", error);
    res.status(500).json({ error: "Unable to checkin order" });
  }
};

module.exports = {
  createOrder,
  getOrdersDashboardInfo,
  getOrderCustomerStylesById,
  getOrderByQR,
  updateOrderById,
  deleteOrderById,
  getAllOrdersWithStyles,
  getCurrentOrders,
  updateEntireOrder,
  checkInOrder,
};
