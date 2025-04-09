const express = require("express");
const pgp = require("pg-promise")();

const app = express();
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
app.listen(3004, function () {
  console.log("Listening on port 3004 ");
});
