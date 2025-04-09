const express = require("express");
const pgp = require("pg-promise")();

const app = express();
const db = pgp(
  `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@postgres:5432/${process.env.DB_NAME}`
);

// GET all investigacionpersona entries with investigation and persona details
app.get("/", function (req, res) {
  const query = `
    SELECT ip.*, inv.titulo AS investigacion_titulo, p.nombres, p.apellidos
    FROM investigacionpersona ip
    JOIN investigacion inv ON ip.investigacionid = inv.investigacionid
    JOIN persona p ON ip.personaid = p.personaid
  `;
  db.query(query)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving investigacionpersona entries");
    });
});

// GET investigacionpersona by id with investigation and persona details
app.get("/:id", function (req, res) {
  const query = `
    SELECT ip.*, inv.titulo AS investigacion_titulo, p.nombres, p.apellidos
    FROM investigacionpersona ip
    JOIN investigacion inv ON ip.investigacionid = inv.investigacionid
    JOIN persona p ON ip.personaid = p.personaid
    WHERE ip.investigacionpersonaid = $1
  `;
  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("InvestigacionPersona not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error retrieving investigacionpersona entry");
    });
});

app.listen(3005, function () {
  console.log("Listening on port 3005 ");
});
