const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all departamentos with a list of municipios
app.get("/", (req, res) => {
  const query = `
    SELECT d.*, json_agg(json_build_object('municipioid', m.municipioid, 'nombre', m.nombre)) AS municipios
    FROM departamento d
    LEFT JOIN municipio m ON d.departamentoid = m.departamentoid
    GROUP BY d.departamentoid
  `;
  db.query(query)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving departamentos");
    });
});

// GET departamento by id with a list of municipios
app.get("/:id", (req, res) => {
  const query = `
    SELECT d.*, json_agg(json_build_object('municipioid', m.municipioid, 'nombre', m.nombre)) AS municipios
    FROM departamento d
    LEFT JOIN municipio m ON d.departamentoid = m.departamentoid
    WHERE d.departamentoid = $1
    GROUP BY d.departamentoid
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) res.status(404).send("Departamento not found");
      else res.json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving departamento");
    });
});

app.listen(3002, function () {
  console.log("Listening on port 3002 ");
});
