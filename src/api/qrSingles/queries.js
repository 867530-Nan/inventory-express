const createQrSingleQuery = `
  INSERT INTO qr_singles (style_id, qr_code)
  VALUES ($1, $2)
  RETURNING *;
`;

const getQrSinglesQuery = "SELECT * FROM qr_singles;";

const getQrSingleByIdQuery = "SELECT * FROM qr_singles WHERE id = $1;";

const getStyleById = `SELECT * from qr_singles qr Left Join styles st on qr.style_id = st.id where qr.id = $1`;

const getStyleByQRCode = `SELECT st.*, qr.* from qr_singles qr Left Join styles st on qr.style_id = st.id where qr.qr_code = $1`;

const latestQRCode =
  "Select qr_code from qr_singles order by qr_code desc limit 1";

const getBulkStylesFromQRCodes = `
SELECT qr.id, qr.qr_code, st.name, st.color, st.id as style_id
FROM qr_singles qr
LEFT JOIN styles st ON qr.style_id = st.id
WHERE qr.id = ANY($1::int[])
`;

const checkIfQRStyleHasInventory = `SELECT qr.*
FROM qr_singles qr
JOIN styles st ON qr.style_id = st.id
WHERE qr.qr_code = $1 
AND st.inventory > 0;`;

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
  getStyleById,
  getStyleByQRCode,
  getBulkStylesFromQRCodes,
  checkIfQRStyleHasInventory,
  latestQRCode,
};
