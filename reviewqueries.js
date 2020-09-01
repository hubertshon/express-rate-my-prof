const Pool = require("pg").Pool;
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "ratemyprofessor",
  password: "password",
  port: 5432,
});
