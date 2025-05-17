const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all areacientifica entries with the count of associated persons
app.get("/", (req, res) => {
  const query = `
    SELECT ac.*, COUNT(pa.personaid) AS total_personas
    FROM areacientifica ac
    LEFT JOIN personaareacientifica pa ON ac.areacientificaid = pa.areacientificaid
    GROUP BY ac.areacientificaid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving areacientifica entries");
    });
});

// GET areacientifica by id with the count of associated persons
app.get("/:id", (req, res) => {
  const query = `
    SELECT ac.*, COUNT(pa.personaid) AS total_personas
    FROM areacientifica ac
    LEFT JOIN personaareacientifica pa ON ac.areacientificaid = pa.areacientificaid
    WHERE ac.areacientificaid = $1
    GROUP BY ac.areacientificaid
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Areacientifica not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving areacientifica entry");
    });
});

// POST a new areacientifica
app.post("/", (req, res) => {
  // Validate required fields
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).send("Nombre is required");
  }

  const query = `
    INSERT INTO areacientifica (nombre)
    VALUES ($1)
    RETURNING *
  `;

  db.query(query, [nombre])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating areacientifica");
    });
});

// PUT update an existing areacientifica
app.put("/:id", (req, res) => {
  // Validate required fields
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).send("Nombre is required");
  }

  const query = `
    UPDATE areacientifica
    SET nombre = $1
    WHERE areacientificaid = $2
    RETURNING *
  `;

  db.query(query, [nombre, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Areacientifica not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating areacientifica");
    });
});

// DELETE an areacientifica by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM areacientifica
    WHERE areacientificaid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Areacientifica not found");
      } else {
        res.status(200).json({
          message: "Areacientifica deleted successfully",
          deletedAreacientifica: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting areacientifica");
    });
});

app.listen(3000, function () {
  console.log("Listening on port 3000 ");
});
