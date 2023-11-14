const createStyle =
  "INSERT INTO styles (name, color, texture, price, inventory, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
const getAllStyles = "SELECT * FROM styles";
const getStyleById = "SELECT * FROM styles WHERE id = $1";
const updateStyle =
  "UPDATE styles SET name = $1, color = $2, texture = $3, price = $4, inventory = $5, image_url = $6 WHERE id = $7 RETURNING *";
const deleteStyle = "DELETE FROM styles WHERE id = $1 RETURNING *";
const getLowInventoryStyles = "SELECT * FROM CHECKOUTS WHERE inventory < 5";

const getDashboardInfoQuery = `SELECT
styles.*,
COUNT(checkouts.id) AS checkout_count
FROM
styles
LEFT JOIN
qr_singles ON styles.id = qr_singles.style_id
LEFT JOIN
checkouts ON qr_singles.id = checkouts.qr_single_id
WHERE
checkouts.checkout_date IS NOT NULL
AND checkouts.checkin_date IS NULL
GROUP BY
styles.id;`;

module.exports = {
  getLowInventoryStyles,
  createStyle,
  getAllStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
  getDashboardInfoQuery,
};
