export default class Storage {
  // categories =========================
  static getAllCategories() {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    return categories.sort((a, b) => {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    });
  }

  static saveCategory(category) {
    const categories = this.getAllCategories();
    const existedItem = categories.find((c) => c.id === category.id);

    if (existedItem) {
      existedItem.title = category.title;
      existedItem.desc = category.desc;
    } else {
      category.id = Date.now();
      category.createdAt = new Date().toISOString();

      categories.push(category);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
  }

  // products =========================
  static getAllProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    return products.sort((a, b) => {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    });
  }

  static saveProduct(product) {
    const products = this.getAllProducts();
    const existedItem = products.find((p) => p.id === product.id);

    if (existedItem) {
      existedItem.title = product.title;
      existedItem.quantity = product.quantity;
      existedItem.category = product.category;
    } else {
      product.id = Date.now();
      product.createdAt = new Date().toISOString();

      products.push(product);
    }

    localStorage.setItem("products", JSON.stringify(products));
  }
}
