const express = require("express");
const pgp = require("pg-promise")();

const app = express();
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

app.listen(3009, function () {
  console.log("Listening on port 3009");
});
