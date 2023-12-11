const createStyle =
  "INSERT INTO styles (name, color, price, inventory) VALUES ($1, $2, $3, $4) RETURNING *";

const getAllStyles = `
SELECT
  s.*,
  COUNT(qr.id) AS inventory
FROM
  styles s
LEFT JOIN
  qr_singles qr ON s.id = qr.style_id
GROUP BY
  s.id
ORDER BY
  s.name;
`;

const getStyleById = "SELECT * FROM styles WHERE id = $1";

const updateStyle =
  "UPDATE styles SET name = $1, color = $2, price = $4, inventory = $5 WHERE id = $7 RETURNING *";

const deleteStyle = "DELETE FROM styles WHERE id = $1 RETURNING *";

const getLowInventoryStyles = "SELECT * FROM STYLES WHERE inventory < 5";

const decreaseStyleInventoryByOneViaQrID = `UPDATE styles
SET inventory = inventory - 1
WHERE id IN (SELECT style_id FROM qr_singles WHERE id = ANY($1::int[]));`;

const increaseStyleInventoryByOneViaQrID = `UPDATE styles
SET inventory = inventory + 1
WHERE id IN (SELECT style_id FROM qr_singles WHERE id = ANY($1::int[]));`;

const getDashboardInfoQuery = `SELECT
styles.*,
COUNT(orders.id) AS order_count
FROM
styles
LEFT JOIN
qr_singles ON styles.id = qr_singles.style_id
LEFT JOIN
orders ON qr_singles.id = orders.qr_single_id
WHERE
orders.checkout_date IS NOT NULL
AND orders.checkin_date IS NULL
GROUP BY
styles.id;`;

const decInv = `Update styles set inventory = inventory - 1`;

const getStyleInfoByName = `
SELECT
    qr.id AS qr_single_id,
    qr.qr_code as qr_code,
    o.id AS order_id,
    o.checkout_date,
    o.checkin_date,
    s.id AS style_id,
    s.name AS name,
    s.color AS color
FROM
    qr_singles qr
JOIN
  styles s ON qr.style_id = s.id
LEFT JOIN
  order_qr_code_relations oq ON qr.id = oq.qr_single_id
LEFT JOIN
  orders o ON oq.order_id = o.id
WHERE
  s.name = $1
AND
  o.checkin_date IS NULL
AND 
  qr.is_archived = false
`;

module.exports = {
  getLowInventoryStyles,
  createStyle,
  getAllStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
  getDashboardInfoQuery,
  decInv,
  getStyleInfoByName,
  decreaseStyleInventoryByOneViaQrID,
  increaseStyleInventoryByOneViaQrID,
};
