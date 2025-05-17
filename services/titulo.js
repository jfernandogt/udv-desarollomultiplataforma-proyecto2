const express = require("express");
const pgp = require("pg-promise")();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new titulo
app.post("/", (req, res) => {
  // Validate required fields
  const { personaid } = req.body;
  if (!personaid) {
    return res.status(400).send("Personaid is required");
  }

  const query = `
    INSERT INTO titulo (personaid, nivel, nombretitulo, institucion, anioobtencion)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    personaid,
    req.body.nivel || null,
    req.body.nombretitulo || null,
    req.body.institucion || null,
    req.body.anioobtencion || null,
  ];

  db.query(query, values)
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating titulo");
    });
});

// PUT update an existing titulo
app.put("/:id", (req, res) => {
  // Validate required fields
  const { personaid } = req.body;
  if (!personaid) {
    return res.status(400).send("Personaid is required");
  }

  const query = `
    UPDATE titulo SET
      personaid = $1,
      nivel = $2,
      nombretitulo = $3,
      institucion = $4,
      anioobtencion = $5
    WHERE tituloid = $6
    RETURNING *
  `;

  const values = [
    personaid,
    req.body.nivel || null,
    req.body.nombretitulo || null,
    req.body.institucion || null,
    req.body.anioobtencion || null,
    req.params.id,
  ];

  db.query(query, values)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Titulo not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating titulo");
    });
});

// DELETE a titulo by ID
app.delete("/:id", (req, res) => {
  const query = `
    DELETE FROM titulo
    WHERE tituloid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Titulo not found");
      } else {
        res.status(200).json({
          message: "Titulo deleted successfully",
          deletedTitulo: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting titulo");
    });
});

app.listen(3010, function () {
  console.log("Listening on port 3010 ");
});
