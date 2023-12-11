const createOrder =
  "INSERT INTO orders (customer_id, checkout_date) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *;";

const getAllOrders = "SELECT * FROM orders";

const getOrderById =
  "SELECT id, checkout_date, checkin_date from orders where id = $1";

const checkInOrder = `Update Orders set checkin_date = CURRENT_DATE where id = $1`;

const getOrderCustomerStylesById = `SELECT
o.id AS order_id,
o.checkout_date,
o.checkin_date,
c.id AS customer_id,
c.name AS customer_name,
c.email AS customer_email,
c.address AS customer_address,
c.phone_number AS customer_phone_number,
JSON_AGG(
  JSON_BUILD_OBJECT(
    'id', qr.id,
    'qr_code', qr.qr_code,
    'style_id', s.id,
    'name', s.name,
    'color', s.color
  )
) AS qr_code_styles
FROM
orders o
LEFT JOIN
customers c ON o.customer_id = c.id
LEFT JOIN
order_qr_code_relations oq ON o.id = oq.order_id
LEFT JOIN
qr_singles qr ON oq.qr_single_id = qr.id
LEFT JOIN
styles s ON qr.style_id = s.id 
WHERE o.id = $1
GROUP BY
o.id, o.checkout_date, o.checkin_date, c.id, c.name, c.email, c.address, c.phone_number;
`;

const getOrdersDashboardInfo = `SELECT
o.id AS order_id,
o.checkout_date,
o.checkin_date,
c.name AS customer_name,
c.email AS customer_email 
FROM
orders o
JOIN
customers c ON o.customer_id = c.id
ORDER BY o.checkout_date desc;
`;

const getOrderByQR =
  "SELECT * FROM orders WHERE qr_codes @> '[ $1 ]' AND checkin_date IS NULL";

const updateOrderById =
  "UPDATE orders SET checkin_date = $1 WHERE id = $2 RETURNING *";

const getAllOrdersWithStyles =
  "SELECT * FROM orders INNER JOIN qr_singles ON orders.qr_single_id = qr_singles.id INNER JOIN styles ON styles.id = qr_singles.style_id";

const deleteOrderById = "DELETE FROM orders WHERE id = $1 RETURNING *";

const getCurrentOrders =
  "SELECT count(*) FROM ORDERS WHERE checkout_date IS NOT NULL AND checkin_date IS NULL";

const getOrdersByBulkQrs = (qrCodes) => {
  const values = qrCodes.map((value) => `'${value}'`).join(",");
  return `SELECT * FROM orders WHERE qr_single_id IN (${values})`;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderCustomerStylesById,
  getOrderByQR,
  updateOrderById,
  deleteOrderById,
  getAllOrdersWithStyles,
  getCurrentOrders,
  getOrdersByBulkQrs,
  getOrdersDashboardInfo,
  getOrderById,
  checkInOrder,
};
