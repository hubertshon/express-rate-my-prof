const Pool = require("pg").Pool;
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "ratemyprofessor",
  password: "password",
  port: 5432,
});

//INDEX
const getProfessors = (request, response) => {
  pool.query("SELECT * FROM professors ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//SHOW
const getProfessorById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM professors WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//CREATE
const createProfessor = (request, response) => {
  const { name, title, school, department, subject } = request.body;

  pool.query(
    "INSERT INTO professors (name, title, school, department, subject) VALUES ($1, $2, $3, $4, $5)",
    [name, title, school, department, subject],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Professor added with ID: ${results.insertId}`);
    }
  );
};

module.exports = {
  getProfessors,
  getProfessorById,
  createProfessor,
};
