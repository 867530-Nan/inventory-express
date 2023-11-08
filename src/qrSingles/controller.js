const db = require("../../db"); // Your database connection
const qrSinglesQueries = require("./queries");
const styleQueries = require("../styles/queries");

// Create a new QR single
const createQrSingle = async (req, res) => {
  const { id, style_id } = req.body;

  try {
    const newQrSingle = await db.query(qrSinglesQueries.createQrSingleQuery, [
      id,
      style_id,
    ]);
    res.status(201).json(newQrSingle.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating a new QR single" });
    console.log("the error", error);
  }
};

// Get all QR singles
const getAllQrSingles = async (req, res) => {
  try {
    const qrSingles = await db.query(qrSinglesQueries.getQrSinglesQuery);
    res.status(200).json(qrSingles.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching QR singles" });
  }
};

// Get a QR single by ID
const getQrSingleById = async (req, res) => {
  const qrSingleId = req.params.id;

  try {
    const qrSingle = await db.query(qrSinglesQueries.getQrSingleByIdQuery, [
      qrSingleId,
    ]);
    if (qrSingle.rows.length === 0) {
      res.status(404).json({ error: "QR single not found" });
    } else {
      const associatedStyle = await db.query(styleQueries.getStyleById, [
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

// Update a QR single by ID
const updateQrSingle = async (req, res) => {
  const qrSingleId = req.params.id;
  const { style_id } = req.body;

  try {
    const updatedQrSingle = await db.query(
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

// Delete a QR single by ID
const deleteQrSingle = async (req, res) => {
  const qrSingleId = req.params.id;

  try {
    const deletedQrSingle = await db.query(
      qrSinglesQueries.deleteQrSingleQuery,
      [qrSingleId],
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

module.exports = {
  createQrSingle,
  getAllQrSingles,
  getQrSingleById,
  updateQrSingle,
  deleteQrSingle,
};
