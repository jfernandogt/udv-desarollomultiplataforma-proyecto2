const express = require("express");
const pgp = require("pg-promise")();

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all investigaciones with facultad information
app.get("/", function (req, res) {
  const query = `
    SELECT i.*, f.nombre AS facultad
    FROM investigacion i
    JOIN facultad f ON i.facultadid = f.facultadid
  `;
  db.query(query)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving investigaciones");
    });
});

// GET investigacion by id with facultad information
app.get("/:id", function (req, res) {
  const query = `
    SELECT i.*, f.nombre AS facultad
    FROM investigacion i
    JOIN facultad f ON i.facultadid = f.facultadid
    WHERE i.investigacionid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Investigacion not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving investigacion");
    });
});

// POST a new investigacion
app.post("/", function (req, res) {
  // Validate required fields
  const { facultadid } = req.body;
  if (!facultadid) {
    return res.status(400).send("Facultadid is required");
  }

  const query = `
    INSERT INTO investigacion (facultadid, anio, titulo, duracion)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const values = [
    facultadid,
    req.body.anio || null,
    req.body.titulo || null,
    req.body.duracion || null,
  ];

  db.query(query, values)
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating investigacion");
    });
});

// PUT update an existing investigacion
app.put("/:id", function (req, res) {
  // Validate required fields
  const { facultadid } = req.body;
  if (!facultadid) {
    return res.status(400).send("Facultadid is required");
  }

  const query = `
    UPDATE investigacion SET
      facultadid = $1,
      anio = $2,
      titulo = $3,
      duracion = $4
    WHERE investigacionid = $5
    RETURNING *
  `;

  const values = [
    facultadid,
    req.body.anio || null,
    req.body.titulo || null,
    req.body.duracion || null,
    req.params.id,
  ];

  db.query(query, values)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Investigacion not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating investigacion");
    });
});

// DELETE an investigacion by ID
app.delete("/:id", function (req, res) {
  const query = `
    DELETE FROM investigacion
    WHERE investigacionid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Investigacion not found");
      } else {
        res.status(200).json({
          message: "Investigacion deleted successfully",
          deletedInvestigacion: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting investigacion");
    });
});
app.listen(3004, function () {
  console.log("Listening on port 3004 ");
});
