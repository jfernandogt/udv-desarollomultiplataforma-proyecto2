const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new municipio
app.post("/", (req, res) => {
  // Validate required fields
  const { nombre, departamentoid } = req.body;
  if (!nombre || !departamentoid) {
    return res.status(400).send("Nombre and departamentoid are required");
  }

  const query = `
    INSERT INTO municipio (nombre, departamentoid)
    VALUES ($1, $2)
    RETURNING *
  `;

  db.query(query, [nombre, departamentoid])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating municipio");
    });
});

// PUT update an existing municipio
app.put("/:id", (req, res) => {
  // Validate required fields
  const { nombre, departamentoid } = req.body;
  if (!nombre || !departamentoid) {
    return res.status(400).send("Nombre and departamentoid are required");
  }

  const query = `
    UPDATE municipio SET
      nombre = $1,
      departamentoid = $2
    WHERE municipioid = $3
    RETURNING *
  `;

  db.query(query, [nombre, departamentoid, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Municipio not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating municipio");
    });
});

// DELETE a municipio by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM municipio
    WHERE municipioid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Municipio not found");
      } else {
        res.status(200).json({
          message: "Municipio deleted successfully",
          deletedMunicipio: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting municipio");
    });
});

app.listen(3006, function () {
  console.log("Listening on port 3006 ");
});
