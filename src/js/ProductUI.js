import Storage from "./Storage.js";

const productTitle = document.querySelector("#product_title");
const productQuantity = document.querySelector("#product_quantity");
const productCategory = document.querySelector("#product_category");

const addNewProductBtn = document.querySelector("#add_new_product_btn");
const cancelEditProductBtn = document.querySelector("#cancel_editProduct_btn");

const searchInput = document.querySelector("#productList_search_input");
const selectSort = document.querySelector("#productList_sort");

const productList = document.querySelector("#product_list");

class ProductUI {
  constructor() {
    addNewProductBtn.addEventListener("click", (e) => {
      if (e.target.innerHTML.trim() === "add new product") {
        this.addNewProduct(e);
      } else {
        this.editProduct(e);
      }
    });

    searchInput.addEventListener("input", (e) => this.searchProducts(e));
    selectSort.addEventListener("change", (e) => this.sortProducts(e));
    cancelEditProductBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.classList.add("hidden");
      addNewProductBtn.innerHTML = "add new product";
      this.resetProductFormFields();
    });

    this.products = [];
    this.sort = "earliest";
    this.selectedProduct = {};
  }

  setupApp() {
    this.updateProductsList();
  }

  addNewProduct(e) {
    e.preventDefault();
    const title = productTitle.value;
    const quantity = productQuantity.value;
    const category = productCategory.value;

    if (!title || !quantity || !category) return;

    Storage.saveProduct({ title, quantity, category });
    this.resetProductFormFields();
    this.updateProductsList();
  }

  createProductList(products, sort = "earliest") {
    products = products.sort((a, b) => {
      if (sort === "earliest") {
        return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
      } else if (sort === "latest") {
        return new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1;
      }
    });

    productList.innerHTML = products
      .map((element) => {
        const selectedCategory = Storage.getAllCategories().find(
          (item) => item.id === Number(element.category)
        );

        return `<div class="flex items-center justify-between">
        <span class="text-slate-300 text-base sm:text-lg md:text-xl"
          >${element.title}</span
        >
        <div class="flex items-center gap-x-2 xs:gap-x-3 text-[10px] xs:text-xs">
          <span>${new Date(element.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}</span>
          <span
            class="border border-gray-600 rounded-full px-1.5 py-0.5 inline-block"
            >${selectedCategory.title}</span
          >
          <span
            class="w-6 h-6 item-center rounded-full border border-slate-500 bg-slate-700"
          >
            ${element.quantity}
          </span>
          <button
            type="button"
            data-id="${element.id}"
            class="delete_product w-6 h-6 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.5 item-center border border-orange-500 text-orange-500 rounded-full inline-block capitalize"
          >
            <span class="hidden sm:inline-block">delete</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 sm:hidden">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
          <button
            type="button"
            data-id="${element.id}"
            class="edit_product w-6 h-6 sm:w-auto sm:h-auto sm:px-1.5 sm:py-0.5 item-center border border-gray-400 text-gray-400 rounded-full inline-block capitalize"
          >
            <span class="hidden sm:inline-block pointer-events-none">edit</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 sm:hidden pointer-events-none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
      </div>`;
      })
      .join("");

    const deleteProductBtns = [...document.querySelectorAll(".delete_product")];
    const editProductBtns = [...document.querySelectorAll(".edit_product")];

    deleteProductBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        const productID = Number(btn.dataset.id);
        Storage.deleteProduct(productID);
        this.updateProductsList();
      })
    );

    editProductBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productID = Number(btn.dataset.id);
        this.selectedProduct = Storage.getAllProducts().find(
          (item) => item.id === productID
        );

        productTitle.value = this.selectedProduct.title;
        productQuantity.value = this.selectedProduct.quantity;
        productCategory.value = this.selectedProduct.category;

        addNewProductBtn.innerHTML = "edit product";
        document
          .querySelector("#cancel_editProduct_btn")
          .classList.remove("hidden");
      });
    });
  }

  // update products list
  updateProductsList() {
    this.products = Storage.getAllProducts();
    this.createProductList(this.products, this.sort);

    document.querySelector("#all_products_quantity").innerHTML =
      Storage.getAllProducts().length;
  }

  searchProducts(e) {
    const value = e.target.value.trim().toLowerCase();

    const filteredProducts = this.products.filter((item) =>
      item.title.toLowerCase().includes(value)
    );

    this.createProductList(filteredProducts, this.sort);
  }

  sortProducts(e) {
    this.sort = e.target.value;
    this.products = Storage.getAllProducts();
    this.createProductList(this.products, this.sort);
  }

  editProduct(e) {
    e.preventDefault();

    this.selectedProduct.title = productTitle.value;
    this.selectedProduct.quantity = productQuantity.value;
    this.selectedProduct.category = productCategory.value;

    if (
      !this.selectedProduct.title ||
      !this.selectedProduct.quantity ||
      !this.selectedProduct.category
    )
      return;

    Storage.saveProduct(this.selectedProduct);

    this.resetProductFormFields();
    this.updateProductsList();

    addNewProductBtn.innerHTML = "add new product";
    cancelEditProductBtn.classList.add("hidden");
  }

  resetProductFormFields() {
    productTitle.value = "";
    productQuantity.value = "";
    productCategory.value = "";
  }
}

export default new ProductUI();
