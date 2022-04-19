const functions = require("firebase-functions");
const admin = require("firebase-admin");

const app = admin.apps.length ? admin.apps[0] : admin.initializeApp();
const firestore = app.firestore();
const productsCollection = firestore.collection("products");
const MAX_SEARCH_RESULTS = 3;

async function getProductThatStartsWith(searchTerm) {
  searchTerm = searchTerm.toString().toLowerCase();
  const searchTermEnd = searchTerm.replace(/.$/,
      (c) => String.fromCharCode(c.charCodeAt(0)+1));

  try {
    // first: try to fetch products with matching id
    const idProducts = await productsCollection
        .where("id", ">=", searchTerm)
        .where("id", "<", searchTermEnd)
        .limit(MAX_SEARCH_RESULTS)
        .get();

    // second: try to fill leftover slots with product name matches
    if (idProducts.size < MAX_SEARCH_RESULTS) {
      const nameProducts = await productsCollection
          .where("product_name_lower", ">=", searchTerm)
          .where("product_name_lower", "<", searchTermEnd)
          .limit(MAX_SEARCH_RESULTS - idProducts.size)
          .get();

      if (idProducts.empty && nameProducts.empty) {
        throw new functions.https.HttpsError("not-found",
            "No matching product found!");
      } else {
        // concat the two results and map query snapshots to plain data
        return idProducts.docs.concat(nameProducts.docs)
            .map((snapshot) => snapshot.data());
      }
    } else { // or return all id-matching products (in case 5 have been found)
      return idProducts.docs.map((snapshot) => snapshot.data());
    }
  } catch (err) {
    if (!(err instanceof functions.https.HttpsError)) {
      throw new functions.https.HttpsError("internal",
          err.toString());
    }
    throw err;
  }
}

module.exports = {
  getProductThatStartsWith,
};
