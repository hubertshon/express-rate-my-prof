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
  pool.query("SELECT * FROM reviews WHERE id = $1", [id], function (error, result1) {
    pool.query("SELECT name FROM professors, reviews WHERE professors.id = reviews.professor_id LIMIT 1", function (error, result2) {
      var ret = {
        reviews: result1.rows,
        professors: result2.rows
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
const createReview = (request, response) => {
  const { author, text, score, professor_id } = request.body;
  const date = new Date();
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

//UPDATE
const updateReview = (request, response) => {
  const id = parseInt(request.params.id);
  const { author, date, text, score, professor_id } = request.body;

  pool.query(
    "UPDATE reviews SET author = $1, date = $2, text = $3, score = $4, professor_id = $5 WHERE id = $6",
    [author, date, text, score, professor_id, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Review updated with ID: ${id}`);
    }
  );
};

const deleteReview = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM reviews WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Review deleted with ID: ${id}`);
  });
};

const updateReviewLike = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("UPDATE reviews SET likes = likes + 1 WHERE id = $1 RETURNING likes;", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//EXPORT functions to index.js

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  updateReviewLike
};
