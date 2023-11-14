const createQrSingleQuery = `
  INSERT INTO qr_singles (id, style_id)
  VALUES ($1, $2)
  RETURNING *;
`;

const getQrSinglesQuery = "SELECT * FROM qr_singles;";

const getQrSingleByIdQuery = "SELECT * FROM qr_singles WHERE id = $1;";

const updateQrSingleQuery = `
  UPDATE qr_singles
  SET style_id = $2
  WHERE id = $1
  RETURNING *;
`;

const deleteQrSingleQuery = "DELETE FROM qr_singles WHERE id = $1;";

const getQrsByStyle = "SELECT * FROM qr_singles WHERE style_id = $1";

module.exports = {
  createQrSingleQuery,
  getQrSinglesQuery,
  getQrSingleByIdQuery,
  updateQrSingleQuery,
  deleteQrSingleQuery,
  getQrsByStyle,
};
