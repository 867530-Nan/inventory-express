const pool = require("../../../db");
const { generateBulkQRCodesStyles } = require("../qrSingles/controller");
const queries = require("./queries");
const qrSinglesQueries = require("../qrSingles/queries");
const orderQueries = require("../orders/queries");

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
    const qrOrders = await pool.query(orderQueries.getOrdersByBulkQrs(justQRs));
    res.status(200).json({ qrSingles: qrSingles.rows, orders: qrOrders.rows });
  } catch (error) {
    console.error("Error getting low inventory styles:", error);
    res.status(500).json({ error: "Unable to get low inventory styles" });
  }
};

const getInfoByStyleName = async (req, res) => {
  const { name } = req.body;
  try {
    const response = await pool.query(queries.getStyleInfoByName, [name]);
    function groupStyles(styles) {
      const groupedByName = styles.reduce((accByName, style) => {
        const { name, color } = style;

        if (!accByName[name]) {
          accByName[name] = {};
        }

        if (!accByName[name][color]) {
          accByName[name][color] = [];
        }

        accByName[name][color].push(style);

        return accByName;
      }, {});

      return groupedByName;
    }
    const getGrouped = groupStyles(response.rows);
    res.status(200).json(getGrouped);
  } catch (error) {
    console.error("Error getting low inventory styles:", error);
    res.status(500).json({ error: "Unable to get low inventory styles" });
  }
};

const getLowInventoryStyles = async (req, res) => {
  try {
    const orders = await pool.query(queries.getLowInventoryStyles);
    res.status(200).json(orders.rows);
  } catch (error) {
    console.error("Error getting low inventory styles:", error);
    res.status(500).json({ error: "Unable to get low inventory styles" });
  }
};

const singleDecreaseInventory = async (req, res) => {
  const styleId = req.params.id;
  try {
    await pool.query(queries.decInv, [styleId]);
  } catch (error) {
    console.error("Error lower inventory styles:", error);
    res.status(500).json({ error: "Unable to lower inventory styles" });
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
  try {
    const style = await pool.query(queries.getDashboardInfoQuery);
    if (style.rows.length === 0) {
      res.status(204).json({ error: "no style dashboard found" });
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
  singleDecreaseInventory,
  getInfoByStyleName,
};
