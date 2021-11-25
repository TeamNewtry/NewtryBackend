const functions = require("firebase-functions");
const off = require("./off-api.js");
const search = require("./search.js");

const baseFunction = functions.region("europe-west1");
exports.getProduct = baseFunction.https.onCall((data) => {
  // fetch product with specific ID from Open Food Facts
  return off.getProduct(data.id)
      .then((offRes) => offRes)
      .catch((err) => err);
});
exports.search = baseFunction.https.onCall((data) => {
  // fetch possible products for given search term
  return search.getProductThatStartsWith(data.searchTerm)
      .then((products) => products)
      .catch((err) => err);
});
