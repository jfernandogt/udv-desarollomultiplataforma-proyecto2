const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all titulos with person information
app.get("/", (req, res) => {
  const query = `
    SELECT t.*, p.nombres, p.apellidos
    FROM titulo t
    JOIN persona p ON t.personaid = p.personaid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving titulos");
    });
});

// GET titulo by id including person information
app.get("/:id", (req, res) => {
  const query = `
    SELECT t.*, p.nombres, p.apellidos
    FROM titulo t
    JOIN persona p ON t.personaid = p.personaid
    WHERE t.tituloid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Titulo not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving titulo");
    });
});

app.listen(3010, function () {
  console.log("Listening on port 3010 ");
});
