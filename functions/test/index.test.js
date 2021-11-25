// NOTE: this script intentionally doesn't use a testing framework like mocha
// as it's main use case is to freely test the exposed firebase functions
const test = require("firebase-functions-test")({
  databaseURL: "https://newtry-1.firebaseio.com",
  storageBucket: "newtry-1.appspot.com",
  projectId: "newtry-1",
}, "test/service-account-key.json");

const fbFunctions = require("../src/index");

// test getProduct
const getProduct = test.wrap(fbFunctions.getProduct);
getProduct({id: 2000572666}).then((productJson) => {
  console.log("getProduct: SUCCESS");
  console.log(productJson);
}).catch((err) => {
  console.error("getProduct: ERROR");
  console.error(err.code);
  console.error(err.message);
  console.error(err.details);
});

// test search
const search = test.wrap(fbFunctions.search);
search({searchTerm: "200057"}).then((searchResultsJson) => {
  console.log("search: SUCCESS");
  console.log(searchResultsJson);
}).catch((err) => {
  console.error("search: ERROR");
  console.error(err.code);
  console.error(err.message);
  console.error(err.details);
});

// cleanup
test.cleanup();
