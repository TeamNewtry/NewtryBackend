const request = require("request");

const baseUrl = "https://de-de.openfoodfacts.org/api/v0/product/";

module.exports = {
  getProduct(productId) {
    return new Promise((resolve, reject) => {
      try {
        request(baseUrl + productId, {json: true}, (err, res, body) => {
          if (err) reject(err);
          // check whether a valid product json object is returned from off-api
          // eslint-disable-next-line max-len
          if (typeof body === "object" && "status" in body && body.status == 1) {
            resolve(body);
          } else {
            // eslint-disable-next-line max-len
            reject(new Error("Server response is no valid product information"));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  },
};
