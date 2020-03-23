import { getProducts } from "./Products.js";
import AppStorage from "./AppStorage.js";
import UI from "./UI.js";

function handleDOMContentLoaded() {
  const ui = new UI();
  // setup app
  ui.setupApp();

  // get all products
  getProducts()
    .then(products => {
      ui.displayProducts(products); // Display products
      AppStorage.saveProducts(products); // Save Products To Local Storage
      ui.cartLogic();
    })
    .then(ui.getBasketButtons);
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

// ============================= end of events and its handlers ===============================
