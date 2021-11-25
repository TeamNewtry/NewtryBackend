const admin = require("firebase-admin");

const app = admin.initializeApp();
const firestore = app.firestore();

const productsCollection = firestore.collection("products");
const MAX_SEARCH_RESULTS = 3;

module.exports = {
  getProductThatStartsWith(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const searchTermEnd = searchTerm.replace(/.$/,
        (c) => String.fromCharCode(c.charCodeAt(0)+1));

    return new Promise((resolve, reject) => {
      // first: try to fetch products with matching id
      const productsIdPromise = productsCollection
          .where("id", ">=", searchTerm)
          .where("id", "<", searchTermEnd)
          .limit(MAX_SEARCH_RESULTS)
          .get();

      productsIdPromise.then((idProducts) => {
        // second: try to fill leftover slots with product name matches
        if (idProducts.size < MAX_SEARCH_RESULTS) {
          const productsNamePromise = productsCollection
              .where("product_name_lower", ">=", searchTerm)
              .where("product_name_lower", "<", searchTermEnd)
              .limit(MAX_SEARCH_RESULTS - idProducts.size)
              .get();

          productsNamePromise.then((nameProducts) => {
            if (idProducts.empty && nameProducts.empty) {
              reject(new Error("No matching product found!"));
            } else {
              // concat the two results and map query snapshots to plain data
              resolve(idProducts.docs.concat(nameProducts.docs)
                  .map((snapshot) => snapshot.data()));
            }
          });
        // or return all id-matching products (in case 5 have been found)
        } else {
          // map query snapshots to plain data
          resolve(idProducts.docs.map((snapshot) => snapshot.data()));
        }
      }).catch((err) => reject(err));
    });
  },
};
