const createOrder =
  "INSERT INTO orders (customer_id, qr_codes, order_date, location_id) VALUES ($1, $2::jsonb, $3, $4) RETURNING *;";

const getAllOrders = "SELECT * FROM orders";

const getOrderById = "SELECT * FROM orders WHERE id = $1";

const getOrderByQR =
  "SELECT * FROM orders WHERE qr_codes @> '[ $1 ]' AND checkin_date IS NULL";

const updateOrderById =
  "UPDATE orders SET checkin_date = $1 WHERE id = $2 RETURNING *";

const getAllOrdersWithStyles =
  "SELECT * FROM orders INNER JOIN qr_singles ON orders.qr_single_id = qr_singles.id INNER JOIN styles ON styles.id = qr_singles.style_id";

const deleteOrderById = "DELETE FROM orders WHERE id = $1 RETURNING *";

const getCurrentOrders =
  "SELECT count(*) FROM ORDERS WHERE order_date IS NOT NULL AND checkin_date IS NULL";

const getOrdersByBulkQrs = (qrCodes) => {
  const values = qrCodes.map((value) => `'${value}'`).join(",");
  return `SELECT * FROM orders WHERE qr_single_id IN (${values})`;
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
  getOrdersByBulkQrs,
};
