/* eslint-disable camelcase */
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "ratemyprofessor",
  password: "password",
  port: 5432,
});

//INDEX
const getReviews = (request, response) => {
  pool.query("SELECT * FROM reviews ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//SHOW
const getReviewById = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query("SELECT * FROM reviews WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.row);
  });
};

//CREATE
const createReview = (request, response) => {
  const { author, date, text, score, professor_id } = request.body;

  pool.query(
    "INSERT INTO reviews (author, date, text, score, professor_id) VALUES ($1, $2, $3, $4, $5)",
    // eslint-disable-next-line camelcase
    [author, date, text, score, professor_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Review added with ID: ${results.insertId}`);
    }
  );
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
};
