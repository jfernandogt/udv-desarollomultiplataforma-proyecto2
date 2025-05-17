const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new carrera
app.post("/", (req, res) => {
  // Validate required fields
  const { nombre, facultadid } = req.body;
  if (!nombre || !facultadid) {
    return res.status(400).send("Nombre and facultadid are required");
  }

  const query = `
    INSERT INTO carrera (nombre, facultadid)
    VALUES ($1, $2)
    RETURNING *
  `;

  db.query(query, [nombre, facultadid])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating carrera");
    });
});

// PUT update an existing carrera
app.put("/:id", (req, res) => {
  // Validate required fields
  const { nombre, facultadid } = req.body;
  if (!nombre || !facultadid) {
    return res.status(400).send("Nombre and facultadid are required");
  }

  const query = `
    UPDATE carrera SET
      nombre = $1,
      facultadid = $2
    WHERE carreraid = $3
    RETURNING *
  `;

  db.query(query, [nombre, facultadid, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Carrera not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating carrera");
    });
});

// DELETE a carrera by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM carrera
    WHERE carreraid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Carrera not found");
      } else {
        res.status(200).json({
          message: "Carrera deleted successfully",
          deletedCarrera: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting carrera");
    });
});

app.listen(3001, function () {
  console.log("Listening on port 3001 ");
});
