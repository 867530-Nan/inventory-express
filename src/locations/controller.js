const pool = require("../../db"); // Your PostgreSQL connection pool
const queries = require("./queries");
// Create a Location (POST Request)
const createLocation = async (req, res) => {
  try {
    const { name, address, types } = req.body;

    const newLocation = await pool.query(queries.createLocation, [
      name,
      address,
      types,
    ]);

    res.status(201).json(newLocation.rows[0]);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Unable to create location" });
  }
};

// Get all Locations (GET Request)
const getAllLocations = async (req, res) => {
  try {
    const locations = await pool.query(queries.getAllLocations);
    res.status(200).json(locations.rows);
  } catch (error) {
    console.error("Error getting locations:", error);
    res.status(500).json({ error: "Unable to get locations" });
  }
};

// Get Location by ID (GET Request)
const getLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const location = await pool.query(queries.getLocationById, [locationId]);

    if (location.rowCount === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(location.rows[0]);
  } catch (error) {
    console.error("Error getting location by ID:", error);
    res.status(500).json({ error: "Unable to get location" });
  }
};

// Update Location by ID (PUT Request)
const updateLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const { name, address, types } = req.body;

    const updatedLocation = await pool.query(queries.updateLocationById, [
      name,
      address,
      types,
      locationId,
    ]);

    if (updatedLocation.rowCount === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(updatedLocation.rows[0]);
  } catch (error) {
    console.error("Error updating location by ID:", error);
    res.status(500).json({ error: "Unable to update location" });
  }
};

// Delete Location by ID (DELETE Request)
const deleteLocationById = async (req, res) => {
  try {
    const locationId = req.params.id;
    const deletedLocation = await pool.query(queries.deleteLocationById, [
      locationId,
    ]);

    if (deletedLocation.rowCount === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    res.status(200).json(deletedLocation.rows[0]);
  } catch (error) {
    console.error("Error deleting location by ID:", error);
    res.status(500).json({ error: "Unable to delete location" });
  }
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
};
