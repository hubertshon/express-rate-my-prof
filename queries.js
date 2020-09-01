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

//UPDATE
const updateProfessor = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, title, school, department, subject } = request.body;

  pool.query(
    "UPDATE professors SET name = $1, title = $2, school = $3, department = $4, subject = $5 WHERE id = $6",
    [name, title, school, department, subject, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Professor modified with ID: ${id}`);
    }
  );
};

//DELETE
const deleteProfessor = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM professors WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Professor deleted with ID: ${id}`);
  });
};

module.exports = {
  getProfessors,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
};
