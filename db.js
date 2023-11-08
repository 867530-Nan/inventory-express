const Pool = require("pg").Pool;

const pool = new Pool({
  username: "mattpeterson",
  host: "localhost",
  database: "inventory_project_two",
  password: "test",
  port: 5432,
});

module.exports = pool;
