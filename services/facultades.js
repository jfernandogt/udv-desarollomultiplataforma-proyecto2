const express = require("express");
const pgp = require("pg-promise")();

const app = express();
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

app.listen(3003, function () {
  console.log("Listening on port 3003 ");
});
