const pool = require("../../../db"); // Your database connection
const qrSinglesQueries = require("./queries");
const styleQueries = require("../styles/queries");
const orderQueries = require("../orders/queries");
const { uuid } = require("uuidv4");

// Create a new QR single
const createQrSingle = async (req, res) => {
  const { style_id } = req.body;

  try {
    const qr_code = await pool.query(qrSinglesQueries.latestQRCode);
    console.log("the latest", qr_code);
    const increased_qr = qr_code.rows[0].qr_code + 1;
    const newQrSingle = await pool.query(qrSinglesQueries.createQrSingleQuery, [
      style_id,
      increased_qr,
    ]);
    res.status(201).json(newQrSingle.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating a new QR single" });
    console.log("the error", error);
  }
};

const latestQRCode = async (req, res) => {
  try {
    const latest = await pool.query(qrSinglesQueries.latestQRCode);
    res.status(200).json(latest.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "error fetching latest qr code" });
    console.log("error fetching latest qr code", error);
  }
};

const generateBulkQRCodesStyles = async (styleID, inventory, res) => {
  const qrCodes = [];

  for (let i = 0; i < inventory; i++) {
    const { qr_code } = await pool.query(qrSinglesQueries.latestQRCode);
    const eyeplusone = i + 1;
    const increased_qr = qr_code + eyeplusone;
    qrCodes.push(increased_qr);
  }
  const sqlQuery = `INSERT INTO qr_singles (style_id, id) VALUES
    ${qrCodes.map((qrc) => `(${styleID}, '${qrc}')`).join(",\n")}
    RETURNING *;`;

  try {
    const newQrs = await pool.query(sqlQuery);
    res.status(200).json(newQrs.rows);
  } catch (error) {
    console.error("Error creating bulk QR Codes:", error);
    res.status(500).json({ error: "Unable to creating bulk QR Codes" });
  }
};

const getAllQrsByStyle = async (req, res) => {
  const styleId = req.params.id;
  try {
    const qrSingles = await pool.query(qrSinglesQueries.getQrsByStyle, [
      styleId,
    ]);
    res.status(200).json(qrSingles.rows);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Error fetching QR singles BY STYLE" });
  }
};

// Get all QR singles
const getAllQrSingles = async (req, res) => {
  try {
    const qrSingles = await pool.query(qrSinglesQueries.getQrSinglesQuery);
    res.status(200).json(qrSingles.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching QR singles" });
  }
};

// Get a QR single by ID
const getQrSingleById = async (req, res) => {
  const qrSingleId = req.params.id;

  try {
    const qrSingle = await pool.query(qrSinglesQueries.getQrSingleByIdQuery, [
      qrSingleId,
    ]);
    if (qrSingle.rows.length === 0) {
      res.status(404).json({ error: "QR single not found" });
    } else {
      const associatedStyle = await pool.query(styleQueries.getStyleById, [
        qrSingle.rows[0].style_id,
      ]);
      if (associatedStyle.rows.length === 0) {
        res.status(404).json({ error: "QR single not found" });
      } else {
        res.status(200).json(associatedStyle.rows);
      }
    }
  } catch (error) {
    console.log("the error 55", error);
    res.status(500).json({ error: "Error fetching the QR single" });
  }
};

const getStyleByQR = async (req, res) => {
  const qrID = req.params.id;
  try {
    const response = await pool.query(qrSinglesQueries.getStyleByQRCode, [
      qrID,
    ]);
    if (response.rows.length > 0) {
      res.status(200).json(response.rows[0]);
    } else {
      // Handle the case where no rows are found
      res.status(404).json({ error: "No matching rows found" });
    }
  } catch (error) {
    console.log("getStyleByQR erro: ", error);
    res.status(500).json({ error: "Error fetching the QR style orders" });
  }
};

const getQRStyleAndOrder = async (req, res) => {
  const qrId = req.params.id;

  try {
    const associatedStyle = await pool.query(qrSinglesQueries.getStyleById, [
      qrId,
    ]);
    const associatedOrders = await pool.query(orderQueries.getOrderByQR, [
      qrId,
    ]);
    res.status(200).json({
      style: associatedStyle.rows,
      orders: associatedOrders.rows,
    });
  } catch (error) {
    console.log("the error 55", error);
    res.status(500).json({ error: "Error fetching the QR style orders" });
  }
};

// Update a QR single by ID
const updateQrSingle = async (req, res) => {
  const qrSingleId = req.params.id;
  const { style_id } = req.body;

  try {
    const updatedQrSingle = await pool.query(
      qrSinglesQueries.updateQrSingleQuery,
      [qrSingleId, style_id],
    );
    if (updatedQrSingle.rows.length === 0) {
      res.status(404).json({ error: "QR single not found" });
    } else {
      res.status(200).json(updatedQrSingle.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the QR single" });
  }
};

const checkHasInventory = async (req, res) => {
  const qrSingleId = req.params.id;

  try {
    const response = await pool.query(
      qrSinglesQueries.checkIfQRStyleHasInventory,
      [qrSingleId],
    );
    if (response.rows.length > 0) {
      res.status(200).json({ message: "There is at least 1 in inventory." });
    } else {
      // Handle the case where no rows are found
      res.status(404).json({ error: "No more inventory" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error checking inventory" });
  }
};

// Delete a QR single by ID
const deleteQrSingle = async (req, res) => {
  const qr_single_id = req.params.id;

  try {
    const deletedQrSingle = await pool.query(
      qrSinglesQueries.deleteQrSingleQuery,
      [qr_single_id],
    );
    if (deletedQrSingle.rowCount === 0) {
      res.status(404).json({ error: "QR single not found" });
    } else {
      res.status(204).end(); // No content, indicating successful deletion
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting the QR single" });
  }
};
// Delete a QR single by ID
const archiveQRSingle = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE qr_singles SET is_archived = true WHERE id = $1",
      [id],
    );
    res
      .status(200)
      .json({ success: true, message: "Updated is_archived column." });
  } catch (error) {
    console.error("Error updating is_archived column:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  createQrSingle,
  getAllQrSingles,
  getQrSingleById,
  updateQrSingle,
  deleteQrSingle,
  getAllQrsByStyle,
  generateBulkQRCodesStyles,
  getQRStyleAndOrder,
  getStyleByQR,
  checkHasInventory,
  latestQRCode,
  archiveQRSingle,
};
