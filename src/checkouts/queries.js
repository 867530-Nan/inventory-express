const createCheckout =
  "INSERT INTO checkouts (customer_email, qr_single_id, checkout_date, checkin_date) VALUES ($1, $2, $3, $4) RETURNING *";

const getAllCheckouts = "SELECT * FROM checkouts";

const getCheckoutById = "SELECT * FROM checkouts WHERE id = $1";

const getCheckoutByQR =
  "SELECT * FROM checkouts WHERE qr_single_id = $1 AND checkin_date IS NULL";

const updateCheckoutById =
  "UPDATE checkouts SET checkin_date = $1 WHERE id = $2 RETURNING *";

const getAllCheckoutsWithStyles =
  "SELECT * FROM checkouts INNER JOIN qr_singles ON checkouts.qr_single_id = qr_singles.id INNER JOIN styles ON styles.id = qr_singles.style_id";

const deleteCheckoutById = "DELETE FROM checkouts WHERE id = $1 RETURNING *";

const getCurrentCheckouts =
  "SELECT count(*) FROM CHECKOUTS WHERE checkout_date IS NOT NULL AND checkin_date IS NULL";

const getCheckoutsByBulkQrs = (qrCodes) => {
  const values = qrCodes.map((value) => `'${value}'`).join(",");
  return `SELECT * FROM checkouts WHERE qr_single_id IN (${values})`;
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
  getCheckoutsByBulkQrs,
};
