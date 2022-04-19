const functions = require("firebase-functions");
const admin = require("firebase-admin");
const request = require("request");

// Caching Vars //
const cacheInsertEnabled = false;
const app = admin.apps.length ? admin.apps[0] : admin.initializeApp();
const firestore = app.firestore();
const cacheCollection = firestore.collection("productCache");

// OFF Vars //
const offTimeout = 5000;
const baseUrl = "https://de-de.openfoodfacts.org/api/v0/product/";

function getCachedProduct(productId) {
  return cacheCollection.doc(productId).get();
}

function cacheProduct(productId, product) {
  if (!cacheInsertEnabled) {
    return;
  }
  cacheCollection.doc(productId).create(product);
}

function getProductFromOff(productId) {
  return new Promise((resolve, reject) => {
    try {
      request(baseUrl + productId, {json: true, timeout: offTimeout},
          (err, res, body) => {
            if (err) reject(err);
            // check for valid product json object being returned from off-api
            // eslint-disable-next-line max-len
            if (typeof body === "object" && "status" in body && body.status == 1) {
              cacheProduct(productId, body);
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
}

async function getProduct(productId) {
  const cachedProduct = await getCachedProduct(productId);
  if (cachedProduct.exists) {
    return cachedProduct.data();
  } else {
    return await getProductFromOff(productId);
  }
}

module.exports = {
  getProduct,
};
