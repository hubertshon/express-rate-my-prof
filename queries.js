require('dotenv').config();

const { Pool } = require("pg");
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;



const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

//INDEX
const getProfessors = (request, response) => {
  pool.query("SELECT professors.*, AVG(reviews.score) FROM professors FULL OUTER JOIN reviews ON professors.id = reviews.professor_id GROUP BY professors.id ORDER BY id ASC;", (error, results) => {
    // pool.query("SELECT * FROM professors ORDER BY id ASC;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//SHOW
const getProfessorById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM professors WHERE id = $1", [id], function (error, result1) {
    pool.query("SELECT * FROM reviews WHERE professor_id = $1", [id], function (error, result2) {
      var ret = {
        professors: result1.rows,
        reviews: result2.rows,
      };
      if (error) {
        throw error;
      }
      response.status(200).json(ret);
    });
    if (error) {
      throw error;
    }
  });
};

//CREATE
const createProfessor = (request, response) => {
  const { name, title, school, department, subject, url } = request.body;

  pool.query(
    "INSERT INTO professors (name, title, school, department, subject, url) VALUES ($1, $2, $3, $4, $5, $6)",
    [name, title, school, department, subject, url],
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
  const { name, title, school, department, subject, url } = request.body;

  pool.query(
    "UPDATE professors SET name = $1, title = $2, school = $3, department = $4, subject = $5, url = $6 WHERE id = $7",
    [name, title, school, department, subject, url, id],
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
  pool
};
