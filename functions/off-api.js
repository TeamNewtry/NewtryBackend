const request = require("request");

const baseUrl = "https://de-de.openfoodfacts.org/api/v0/product/";

module.exports = {
  getProduct(productId) {
    return new Promise((resolve, reject) => {
      try {
        request(baseUrl + productId, {json: true}, (err, res, body) => {
          if (err) reject(err);
          resolve(body);
        });
      } catch (e) {
        console.error(e);
      }
    });
  },
};
