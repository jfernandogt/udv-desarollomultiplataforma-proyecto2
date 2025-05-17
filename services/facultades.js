const express = require("express");
const pgp = require("pg-promise")();

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all facultades with persons count
app.get("/", function (req, res) {
  const query = `
    SELECT f.*, COUNT(pf.personaid) AS total_personas
    FROM facultad f
    LEFT JOIN personafacultad pf ON f.facultadid = pf.facultadid
    GROUP BY f.facultadid
  `;
  db.query(query)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving faculties");
    });
});

// GET facultad by id with persons count
app.get("/:id", function (req, res) {
  const query = `
    SELECT f.*, COUNT(pf.personaid) AS total_personas
    FROM facultad f
    LEFT JOIN personafacultad pf ON f.facultadid = pf.facultadid
    WHERE f.facultadid = $1
    GROUP BY f.facultadid
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Facultad not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving facultad");
    });
});

// POST a new facultad
app.post("/", function (req, res) {
  // Validate required fields
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).send("Nombre is required");
  }

  const query = `
    INSERT INTO facultad (nombre, siglas, telefono, correo)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    nombre,
    req.body.siglas || null,
    req.body.telefono || null,
    req.body.correo || null,
  ];

  db.query(query, values)
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating facultad");
    });
});

// PUT update an existing facultad
app.put("/:id", function (req, res) {
  // Validate required fields
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).send("Nombre is required");
  }

  const query = `
    UPDATE facultad SET
      nombre = $1,
      siglas = $2,
      telefono = $3,
      correo = $4
    WHERE facultadid = $5
    RETURNING *
  `;

  const values = [
    nombre,
    req.body.siglas || null,
    req.body.telefono || null,
    req.body.correo || null,
    req.params.id,
  ];

  db.query(query, values)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Facultad not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating facultad");
    });
});

// DELETE a facultad by ID
app.delete("/:id", function (req, res) {
  const query = `
    DELETE FROM facultad
    WHERE facultadid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Facultad not found");
      } else {
        res.status(200).json({
          message: "Facultad deleted successfully",
          deletedFacultad: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting facultad");
    });
});

app.listen(3003, function () {
  console.log("Listening on port 3003 ");
});
