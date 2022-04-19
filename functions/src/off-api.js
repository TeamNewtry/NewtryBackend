const functions = require("firebase-functions");
const request = require("request");

const offTimeout = 3000;
const baseUrl = "https://de-de.openfoodfacts.org/api/v0/product/";

module.exports = {
  getProduct(productId) {
    return new Promise((resolve, reject) => {
      try {
        request(baseUrl + productId, {json: true, timeout: offTimeout},
            (err, res, body) => {
              if (err) reject(err);
              // check for valid product json object being returned from off-api
              if (typeof body === "object" &&
                "status" in body && body.status == 1) {
                resolve(body);
              } else {
                // eslint-disable-next-line max-len
                reject(new functions.https.HttpsError("unavailable", "Server response is no valid product information"));
              }
            });
      } catch (e) {
        reject(new functions.https.HttpsError("internal", e.toString()));
      }
    });
  },
};
