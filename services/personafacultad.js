const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new personafacultad
app.post("/", (req, res) => {
  // Validate required fields
  const { facultadid, personaid } = req.body;
  if (!facultadid || !personaid) {
    return res.status(400).send("Facultadid and personaid are required");
  }

  const query = `
    INSERT INTO personafacultad (facultadid, personaid)
    VALUES ($1, $2)
    RETURNING *
  `;

  db.query(query, [facultadid, personaid])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating personafacultad");
    });
});

// PUT update an existing personafacultad
app.put("/:id", (req, res) => {
  // Validate required fields
  const { facultadid, personaid } = req.body;
  if (!facultadid || !personaid) {
    return res.status(400).send("Facultadid and personaid are required");
  }

  const query = `
    UPDATE personafacultad SET
      facultadid = $1,
      personaid = $2
    WHERE personafacultadid = $3
    RETURNING *
  `;

  db.query(query, [facultadid, personaid, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Personafacultad not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating personafacultad");
    });
});

// DELETE a personafacultad by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM personafacultad
    WHERE personafacultadid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Personafacultad not found");
      } else {
        res.status(200).json({
          message: "Personafacultad deleted successfully",
          deletedPersonafacultad: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting personafacultad");
    });
});

app.listen(3008, function () {
  console.log("Listening on port 3008 ");
});
