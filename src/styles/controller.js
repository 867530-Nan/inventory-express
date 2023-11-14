const pool = require("../../db"); // Your PostgreSQL database connection
const { generateBulkQRCodesStyles } = require("../qrSingles/controller");
const queries = require("./queries");
const qrSinglesQueries = require("../qrSingles/queries");
const checkoutQueries = require("../checkouts/queries");

// Create a new style
const createStyle = async (req, res) => {
  const { name, color, texture, price, inventory, image_url } = req.body;

  try {
    const newStyle = await pool.query(queries.createStyle, [
      name,
      color,
      texture,
      price,
      inventory,
      image_url,
    ]);

    generateBulkQRCodesStyles(
      newStyle.rows[0].id,
      newStyle.rows[0].inventory,
      res,
    );
  } catch (error) {
    console.log("error creating new style", error);
    res.status(500).json({ error: "Error creating a new style" });
  }
};

const getInfoRelativeToStyle = async (req, res) => {
  const styleId = req.params.id;
  try {
    const qrSingles = await pool.query(qrSinglesQueries.getQrsByStyle, [
      styleId,
    ]);
    const justQRs = qrSingles.rows.map((s) => s.id);
    const qrCheckouts = await pool.query(
      checkoutQueries.getCheckoutsByBulkQrs(justQRs),
    );
    res
      .status(200)
      .json({ qrSingles: qrSingles.rows, checkouts: qrCheckouts.rows });
  } catch (error) {
    console.error("Error getting low inventory styles:", error);
    res.status(500).json({ error: "Unable to get low inventory styles" });
  }
};

const getLowInventoryStyles = async (req, res) => {
  try {
    const checkouts = await pool.query(queries.getLowInventoryStyles);
    res.status(200).json(checkouts.rows);
  } catch (error) {
    console.error("Error getting low inventory styles:", error);
    res.status(500).json({ error: "Unable to get low inventory styles" });
  }
};

// Get all styles
const getAllStyles = async (req, res) => {
  try {
    const styles = await pool.query(queries.getAllStyles);
    res.status(200).json(styles.rows);
  } catch (error) {
    console.log("styles error: ", error);
    res.status(500).json({ error: "Error fetching styles" });
  }
};

// Get a style by ID
const getStyleById = async (req, res) => {
  const styleId = req.params.id;

  try {
    const style = await pool.query(queries.getStyleById, [styleId]);
    if (style.rows.length === 0) {
      res.status(404).json({ error: "Style not found" });
    } else {
      res.status(200).json(style.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching the style" });
  }
};

// Update a style by ID
const updateStyle = async (req, res) => {
  const styleId = req.params.id;
  const { name, color, texture, price, inventory, image_url } = req.body;

  try {
    const updatedStyle = await pool.query(queries.updateStyle, [
      name,
      color,
      texture,
      price,
      inventory,
      image_url,
      styleId,
    ]);

    if (updatedStyle.rows.length === 0) {
      res.status(404).json({ error: "Style not found" });
    } else {
      res.status(200).json(updatedStyle.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating the style" });
  }
};

// Delete a style by ID
const deleteStyle = async (req, res) => {
  const styleId = req.params.id;

  try {
    const deletedStyle = await pool.query(queries.deleteStyle, [styleId]);

    if (deletedStyle.rows.length === 0) {
      res.status(404).json({ error: "Style not found" });
    } else {
      res.status(204).end(); // No content, indicating successful deletion
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting the style" });
  }
};

const getDashboardInfo = async (req, res) => {
  const styleId = req.params.id;

  try {
    const style = await pool.query(queries.getDashboardInfoQuery);
    if (style.rows.length === 0) {
      res.status(404).json({ error: "no style dashboard found" });
    } else {
      res.status(200).json(style.rows);
    }
  } catch (error) {
    console.error("dashboard error", error);
    res.status(500).json({ error: "Error fetching the style" });
  }
};

module.exports = {
  createStyle,
  getAllStyles,
  getStyleById,
  updateStyle,
  deleteStyle,
  getLowInventoryStyles,
  getInfoRelativeToStyle,
  getDashboardInfo,
};
