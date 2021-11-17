const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");
const off = require("./off-api.js");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// Bind REST endpoints
app.get("/product/:id", (req, res) => {
  // fetch product with specific ID from Open Food Facts
  off.getProduct(req.params.id)
      .then((offRes) => res.json(offRes))
      .catch((err) => res.send(err));
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
