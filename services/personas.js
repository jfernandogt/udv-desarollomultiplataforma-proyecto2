const express = require("express");
const pgp = require("pg-promise")();

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

app.get("/", function (req, res) {
  const query = `
    SELECT persona.*, 
           municipio.nombre AS municipio, 
           departamento.nombre AS departamento
    FROM persona 
    LEFT JOIN municipio ON persona.municipioidnacimiento = municipio.municipioid
    LEFT JOIN departamento ON municipio.departamentoid = departamento.departamentoid
  `;
  db.query(query)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/:id", function (req, res) {
  const query = `
    SELECT persona.*, 
           municipio.nombre AS municipio, 
           departamento.nombre AS departamento
    FROM persona 
    LEFT JOIN municipio ON persona.municipioidnacimiento = municipio.municipioid
    LEFT JOIN departamento ON municipio.departamentoid = departamento.departamentoid
    WHERE persona.personaid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Persona not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error retrieving data");
    });
});

app.post("/", function (req, res) {
  // Validate required fields
  const { nombres, apellidos } = req.body;
  if (!nombres || !apellidos) {
    return res.status(400).send("Nombres and apellidos are required");
  }

  // Construct query with all possible fields
  const query = `
    INSERT INTO persona (
      nombres, apellidos, telefono, celular, correo,
      direccion, municipioidnacimiento, fechanacimiento, cui,
      pasaporte, tiporol
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING *
  `;

  // Extract values from request body with defaults for optional fields
  const values = [
    nombres,
    apellidos,
    req.body.telefono || null,
    req.body.celular || null,
    req.body.correo || null,
    req.body.direccion || null,
    req.body.municipioidnacimiento || null,
    req.body.fechanacimiento || null,
    req.body.cui || null,
    req.body.pasaporte || null,
    req.body.tiporol || null,
  ];

  // Execute query
  db.query(query, values)
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error creating persona");
    });
});

// PUT update an existing persona
app.put("/:id", function (req, res) {
  // Validate required fields
  const { nombres, apellidos } = req.body;
  if (!nombres || !apellidos) {
    return res.status(400).send("Nombres and apellidos are required");
  }

  // Construct query with all possible fields
  const query = `
    UPDATE persona SET
      nombres = $1, 
      apellidos = $2, 
      telefono = $3, 
      celular = $4, 
      correo = $5,
      direccion = $6, 
      municipioidnacimiento = $7, 
      fechanacimiento = $8, 
      cui = $9,
      pasaporte = $10, 
      tiporol = $11
    WHERE personaid = $12
    RETURNING *
  `;

  // Extract values from request body with defaults for optional fields
  const values = [
    nombres,
    apellidos,
    req.body.telefono || null,
    req.body.celular || null,
    req.body.correo || null,
    req.body.direccion || null,
    req.body.municipioidnacimiento || null,
    req.body.fechanacimiento || null,
    req.body.cui || null,
    req.body.pasaporte || null,
    req.body.tiporol || null,
    req.params.id,
  ];

  // Execute query
  db.query(query, values)
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Persona not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error updating persona");
    });
});

// DELETE a persona by ID
app.delete("/:id", function (req, res) {
  const query = `
    DELETE FROM persona
    WHERE personaid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("Persona not found");
      } else {
        res
          .status(200)
          .json({
            message: "Persona deleted successfully",
            deletedPersona: data[0],
          });
      }
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error deleting persona");
    });
});

app.listen(3009, function () {
  console.log("Listening on port 3009");
});
