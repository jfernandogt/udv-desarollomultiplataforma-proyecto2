const express = require("express");
const pgp = require("pg-promise")();

const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
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

// POST a new investigacionpersona
app.post("/", function (req, res) {
  // Validate required fields
  const { investigacionid, personaid } = req.body;
  if (!investigacionid || !personaid) {
    return res.status(400).send("Investigacionid and personaid are required");
  }

  const query = `
    INSERT INTO investigacionpersona (investigacionid, personaid)
    VALUES ($1, $2)
    RETURNING *
  `;

  db.query(query, [investigacionid, personaid])
    .then((data) => {
      res.status(201).json(data[0]);
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error creating investigacionpersona");
    });
});

// PUT update an existing investigacionpersona
app.put("/:id", function (req, res) {
  // Validate required fields
  const { investigacionid, personaid } = req.body;
  if (!investigacionid || !personaid) {
    return res.status(400).send("Investigacionid and personaid are required");
  }

  const query = `
    UPDATE investigacionpersona SET
      investigacionid = $1,
      personaid = $2
    WHERE investigacionpersonaid = $3
    RETURNING *
  `;

  db.query(query, [investigacionid, personaid, req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("InvestigacionPersona not found");
      } else {
        res.json(data[0]);
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error updating investigacionpersona");
    });
});

// DELETE an investigacionpersona by ID
app.delete("/:id", function (req, res) {
  const query = `
    DELETE FROM investigacionpersona
    WHERE investigacionpersonaid = $1
    RETURNING *
  `;

  db.query(query, [req.params.id])
    .then((data) => {
      if (data.length === 0) {
        res.status(404).send("InvestigacionPersona not found");
      } else {
        res.status(200).json({
          message: "InvestigacionPersona deleted successfully",
          deletedInvestigacionPersona: data[0],
        });
      }
    })
    .catch((error) => {
      console.error("ERROR:", error);
      res.status(500).send("Error deleting investigacionpersona");
    });
});

app.listen(3005, function () {
  console.log("Listening on port 3005 ");
});
