// ============================= data access API ===============================
// getProducts,getProductById

async function getProducts() {
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

async function getProductById(id) {
  try {
    const products = await this.getProducts();
    const prod = await products.find(item => item.id === id); //
    console.log(prod);
    return prod;
  } catch (error) {
    console.log(error);
  }
}

export { getProducts, getProductById };

// ============================= end of data access API ===============================

/*
export default class Products {
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

  getProductsAsync() {
    return this.getProducts();
  }

  getProductByIdAsync(id) {
    return this.getProductById(id);
  }
}
*/

// export { getProductsAsync, getProductByIdAsync };
// export default Products;
