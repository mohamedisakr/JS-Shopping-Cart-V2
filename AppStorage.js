// ============================= end of shopping cart variable ===============================
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
export default AppStorage;
