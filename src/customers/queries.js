const newCustomer =
  "INSERT INTO customers (name, email, address, phone_number) VALUES ($1, $2, $3, $4) RETURNING *";

const getAllCustomers = "SELECT * FROM customers";

const getCustomerById = "SELECT * FROM customers WHERE id = $1";

const updateCustomerById =
  "UPDATE customers SET name = $1, email = $2, address = $3, phone_number = $4 WHERE id = $5 RETURNING *";

const deleteCustomer = "DELETE FROM customers WHERE id = $1 RETURNING *";
module.exports = {
  newCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomer,
};
