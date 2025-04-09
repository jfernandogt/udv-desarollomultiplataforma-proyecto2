const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all personafacultad entries with related person and facultad info
app.get("/", (req, res) => {
  const query = `
    SELECT pf.*, p.nombres, p.apellidos, f.nombre AS facultad
    FROM personafacultad pf
    JOIN persona p ON pf.personaid = p.personaid
    JOIN facultad f ON pf.facultadid = f.facultadid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving personafacultad entries");
    });
});

// GET personafacultad by id with related info
app.get("/:id", (req, res) => {
  const query = `
    SELECT pf.*, p.nombres, p.apellidos, f.nombre AS facultad
    FROM personafacultad pf
    JOIN persona p ON pf.personaid = p.personaid
    JOIN facultad f ON pf.facultadid = f.facultadid
    WHERE pf.personafacultadid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Personafacultad not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving personafacultad entry");
    });
});

app.listen(3008, function () {
  console.log("Listening on port 3008 ");
});
