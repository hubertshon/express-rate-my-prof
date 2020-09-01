const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./queries");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

//ROUTES

app.get("/professors", db.getProfessors);
app.get("/professors/:id", db.getProfessorById);
app.post("/professors", db.createProfessor);
app.put("/professors/:id", db.updateProfessor);
app.delete("/professors/:id", db.deleteProfessor);
