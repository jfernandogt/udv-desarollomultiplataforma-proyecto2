const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new personaareacientifica
app.post("/", (req, res) => {
  // Validate required fields
  const { areacientificaid, personaid } = req.body;
  if (!areacientificaid || !personaid) {
    return res.status(400).send("Areacientificaid and personaid are required");
  }

  const query = `
    INSERT INTO personaareacientifica (areacientificaid, personaid)
    VALUES ($1, $2)
    RETURNING *
  `;

  db.query(query, [areacientificaid, personaid])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating personaareacientifica");
    });
});

// PUT update an existing personaareacientifica
app.put("/:id", (req, res) => {
  // Validate required fields
  const { areacientificaid, personaid } = req.body;
  if (!areacientificaid || !personaid) {
    return res.status(400).send("Areacientificaid and personaid are required");
  }

  const query = `
    UPDATE personaareacientifica SET
      areacientificaid = $1,
      personaid = $2
    WHERE personaareacientificaid = $3
    RETURNING *
  `;

  db.query(query, [areacientificaid, personaid, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Personaareacientifica not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating personaareacientifica");
    });
});

// DELETE a personaareacientifica by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM personaareacientifica
    WHERE personaareacientificaid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Personaareacientifica not found");
      } else {
        res.status(200).json({
          message: "Personaareacientifica deleted successfully",
          deletedPersonaareacientifica: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting personaareacientifica");
    });
});

app.listen(3007, function () {
  console.log("Listening on port 3007 ");
});
