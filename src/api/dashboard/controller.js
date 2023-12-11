const pool = require("../../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");
// Create a Location (POST Request)
const getMostPopularStyle = async (req, res) => {
  try {
    console.log("most popular");
    const mostPopular = await pool.query(queries.getMostPopularStyle, []);

    res.status(200).json(mostPopular.rows);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Unable to create location" });
  }
};

const getZeroInventoryStyles = async (req, res) => {
  try {
    const zeroInv = await pool.query(queries.getZeroInventoryStyles, []);

    res.status(200).json(zeroInv.rows);
  } catch (error) {
    console.error("Error getting zero inventory styles:", error);
    res.status(500).json({ error: "Error getting zero inventory styles" });
  }
};

const getNumberOfCheckedOutSamples = async (req, res) => {
  try {
    const checkedout = await pool.query(queries.numberOfCheckedOutSamples, []);

    res.status(200).json(checkedout.rows[0].count);
  } catch (error) {
    console.error("Error getting checked out samples:", error);
    res.status(500).json({ error: "Error getting checked out samples" });
  }
};

module.exports = {
  getMostPopularStyle,
  getZeroInventoryStyles,
  getNumberOfCheckedOutSamples,
};
