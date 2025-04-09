const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all personaareacientifica entries with person and area details
app.get("/", (req, res) => {
  const query = `
    SELECT pa.*, p.nombres, p.apellidos, ac.nombre AS areacientifica
    FROM personaareacientifica pa
    JOIN persona p ON pa.personaid = p.personaid
    JOIN areacientifica ac ON pa.areacientificaid = ac.areacientificaid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving personaareacientifica entries");
    });
});

// GET personaareacientifica by id with person and area details
app.get("/:id", (req, res) => {
  const query = `
    SELECT pa.*, p.nombres, p.apellidos, ac.nombre AS areacientifica
    FROM personaareacientifica pa
    JOIN persona p ON pa.personaid = p.personaid
    JOIN areacientifica ac ON pa.areacientificaid = ac.areacientificaid
    WHERE pa.personaareacientificaid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0)
        res.status(404).send("Personaareacientifica not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving personaareacientifica entry");
    });
});

app.listen(3007, function () {
  console.log("Listening on port 3007 ");
});
