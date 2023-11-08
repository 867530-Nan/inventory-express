const createLocation =
  "INSERT INTO locations (name, address, types) VALUES ($1, $2, $3) RETURNING *";

const getAllLocations = "SELECT * FROM locations";

const getLocationById = "SELECT * FROM locations WHERE id = $1";

const updateLocationById =
  "UPDATE locations SET name = $1, address = $2, types = $3 WHERE id = $4 RETURNING *";

const deleteLocationById = "DELETE FROM locations WHERE id = $1 RETURNING *";

module.exports = {
  createLocation,
  getAllLocations,
  updateLocationById,
  deleteLocationById,
  getLocationById,
};
