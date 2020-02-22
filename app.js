// ============================= variables ===============================
const cartButton = document.querySelector(".cart-btn");
const closeCartButton = document.querySelector(".close-cart");
const clearCartButton = document.querySelector(".clear-cart"); // clear-cart
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// ============================= end of variables ===============================

// ============================= shopping cart variable ===============================
let cart = [];
let buttonsDOM = [];
// ============================= end of shopping cart variable ===============================

// ============================= data access API ===============================

class Products {
  async getProducts() {
    try {
      const result = await fetch("products.json");
      const data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { id } = item.sys;
        const { title, price } = item.fields;
        const imageURL = item.fields.image.fields.file.url;
        return { id, title, price, imageURL };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const prod = products.find(item => item.id === id); // await
      console.log(prod);
      return prod;
    } catch (error) {
      console.log(error);
    }
  }
}

// ============================= end of data access API ===============================

// ============================= Local Storage ===============================
class AppStorage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProductById(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    const prod = products.find(item => item.id === id);
    // console.log(prod);
    return prod;
  }

  static saveCartToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCartFromLocalStorage() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
// ============================= end of Local Storage ===============================

// ============================= UI Functionality ===============================
class UI {
  // constructor() {
  //   this.setCartValues = this.setCartValues.bind(this);
  // }

  displayProducts = products => {
    var result = "";
    products.forEach(
      product =>
        (result += `  
      <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img src=${product.imageURL}  alt=${product.title}  class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart">add to basket</i>
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
      <!-- end of single product -->`)
    );
    productsDOM.innerHTML = result;
  };

  populateCart = cart => {
    cart.forEach(item => this.addCartItem(item));
  };

  setupApp = () => {
    cart = AppStorage.getCartFromLocalStorage();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartButton.addEventListener("click", this.showCart);
    closeCartButton.addEventListener("click", this.hideCart);
  };

  showCart = () => {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  };

  hideCart = () => {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  };

  getSingleButton = id => {
    return buttonsDOM.find(button => button.dataset.id === id);
  };

  removeItem = id => {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    AppStorage.saveCartToLocalStorage(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart">add to basket</i>`;
  };

  clearCart = () => {
    const ids = cart.map(item => item.id);
    ids.forEach(id => this.removeItem(id));
    console.log(cartContent.children);

    // remove it from DOM
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  };

  cartLogic = () => {
    // handle clear all items in the shopping cart and also from local storage
    clearCartButton.addEventListener("click", this.clearCart);

    // handle remove item from shopping cart
    // handle increase and decrease amount
    cartContent.addEventListener("click", event => {
      // class="remove-item" class="fas fa-chevron-up" class="fas fa-chevron-down"
      if (event.target.classList.contains("remove-item")) {
        let itemToRemove = event.target;
        let id = itemToRemove.dataset.id;
        cartContent.removeChild(itemToRemove.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let itemToIncreaseAmount = event.target;
        let id = itemToIncreaseAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        console.log(tempItem);
        tempItem.amount += 1;
        AppStorage.saveCartToLocalStorage(cart);
        this.setCartValues(cart);
        itemToIncreaseAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let itemToDecreaseAmount = event.target;
        let id = itemToDecreaseAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        console.log(tempItem);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          AppStorage.saveCartToLocalStorage(cart);
          this.setCartValues(cart);
          itemToDecreaseAmount.previousElementSibling.innerText =
            tempItem.amount;
        } else {
          cartContent.removeChild(
            itemToDecreaseAmount.parentElement.parentElement
          );
          this.removeItem(id);
        }
      }
    });
  };

  addCartItem = item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.imageURL} alt=${item.title} />
    <div>
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;
    cartContent.appendChild(div);
    // console.log(cartContent);
  };

  setCartValues = cart => {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.forEach(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  };

  getBasketButtons = () => {
    const basketButtons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = basketButtons;
    basketButtons.forEach(button => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        // TODO:
        // get product from products
        const cartItem = { ...AppStorage.getProductById(id), amount: 1 };
        //console.log(cartItem);

        // add product to the cart
        cart = [...cart, cartItem];
        // console.log(cart);

        // save cart in local storage
        AppStorage.saveCartToLocalStorage(cart);

        // set cart values
        this.setCartValues(cart);

        // display cart item
        this.addCartItem(cartItem);

        // show the cart
        this.showCart();
      });
    });
  };
}

// ============================= end of UI Functionality ===============================

// ============================= events and its handlers ===============================

function handleDOMContentLoaded() {
  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupApp();

  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products); // Display products
      AppStorage.saveProducts(products); // Save Products To Local Storage
      ui.cartLogic();
    })
    .then(ui.getBasketButtons);
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

// ============================= end of events and its handlers ===============================
