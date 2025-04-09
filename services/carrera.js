const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all carreras with facultad information
app.get("/", (req, res) => {
  const query = `
    SELECT c.*, f.nombre AS facultad
    FROM carrera c
    JOIN facultad f ON c.facultadid = f.facultadid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving carreras");
    });
});

// GET carrera by id with facultad information
app.get("/:id", (req, res) => {
  const query = `
    SELECT c.*, f.nombre AS facultad
    FROM carrera c
    JOIN facultad f ON c.facultadid = f.facultadid
    WHERE c.carreraid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Carrera not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving carrera");
    });
});

app.listen(3001, function () {
  console.log("Listening on port 3001 ");
});
