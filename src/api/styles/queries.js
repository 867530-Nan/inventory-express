const createStyle =
  "INSERT INTO styles (name, color, price, inventory) VALUES ($1, $2, $3, $4) RETURNING *";
const getAllStyles = "SELECT * FROM styles";
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
orders.order_date IS NOT NULL
AND orders.checkin_date IS NULL
GROUP BY
styles.id;`;

const decInv = `Update styles set inventory = inventory - 1`;

const getStyleInfoByName = `
  SELECT 
    styles.*,
    qr_singles.qr_code
  FROM styles
  JOIN qr_singles ON styles.id = qr_singles.style_id
  WHERE styles.name = $1;
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
