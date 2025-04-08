const express = require("express");
const pgp = require("pg-promise")();

const app = express();
const db = pgp("postgres://root:toor@postgres:5432/main");

app.get("/", function (req, res) {
  db.query("SELECT * FROM personas")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).send("Error retrieving data");
    });
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
