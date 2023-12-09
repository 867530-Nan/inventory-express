const newCustomer =
  "INSERT INTO customers (name, email, address, phone_number) VALUES ($1, $2, $3, $4) RETURNING *";

const createCustomerIfEmailDoesntExist =
  "INSERT INTO customers (name, address, phone_number, email) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = customers.name RETURNING *";

const getAllCustomers = "SELECT * FROM customers";

const getCustomerById = "SELECT * FROM customers WHERE id = $1";

const updateCustomerById =
  "UPDATE customers SET name = $1, email = $2, address = $3, phone_number = $4 WHERE id = $5 RETURNING *";

const updateCustomerByOrderId = `
UPDATE customers 
SET name = $1, email = $2, address = $3, phone_number = $4 
WHERE id = (SELECT customer_id FROM orders WHERE id = $5) 
RETURNING *;
`;

const deleteCustomer = "DELETE FROM customers WHERE id = $1 RETURNING *";

const findCustomersLikeString = "SELECT * FROM customers WHERE name ILIKE $1";

module.exports = {
  newCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomer,
  findCustomersLikeString,
  createCustomerIfEmailDoesntExist,
  updateCustomerByOrderId,
};
