const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all municipios with departamento information
app.get("/", (req, res) => {
  const query = `
    SELECT m.*, d.nombre AS departamento
    FROM municipio m
    JOIN departamento d ON m.departamentoid = d.departamentoid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving municipios");
    });
});

// GET municipio by id with departamento information
app.get("/:id", (req, res) => {
  const query = `
    SELECT m.*, d.nombre AS departamento
    FROM municipio m
    JOIN departamento d ON m.departamentoid = d.departamentoid
    WHERE m.municipioid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Municipio not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving municipio");
    });
});

app.listen(3006, function () {
  console.log("Listening on port 3006 ");
});
