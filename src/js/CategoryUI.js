import Storage from "./Storage.js";

const categoryTitle = document.querySelector("#category_title");
const categoryDesc = document.querySelector("#category_desc");
const addNewCategoryBtn = document.querySelector("#add_new_category_btn");
const toggleCategoryBtn = document.querySelector("#toggle_category_btn");
const cancelCategoryBtn = document.querySelector("#cancel_category_btn");
const categoryForm = document.querySelector("#category_form");

class CategoryUI {
  constructor() {
    addNewCategoryBtn.addEventListener("click", (e) => this.addNewCategory(e));
    toggleCategoryBtn.addEventListener("click", (e) =>
      this.toggleAddCategory(e)
    );
    cancelCategoryBtn.addEventListener("click", (e) =>
      this.cancelAddCategory(e)
    );
    this.categories = [];
  }

  // add new category
  addNewCategory(e) {
    e.preventDefault();

    const title = categoryTitle.value;
    const description = categoryDesc.value;

    if (!title || !description) return;

    Storage.saveCategory({ title, description });

    categoryTitle.value = "";
    categoryDesc.value = "";

    this.updateCategoriesOptionList();

    categoryForm.classList.add("hidden");
    toggleCategoryBtn.classList.remove("hidden");
  }

  // create products categories options
  createCategoriesOptionList() {
    let result = `<option value="" class="bg-sky-800">select a category</option>`;

    result += this.categories
      .map((element) => {
        return `<option value="${element.id}" class="bg-sky-800">${element.title}</option>`;
      })
      .join("");

    document.querySelector("#product_category").innerHTML = result;
  }

  // update products categories options
  updateCategoriesOptionList() {
    this.categories = Storage.getAllCategories().sort((a, b) => {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    });
    this.createCategoriesOptionList();
  }

  // set app for initial render
  setupApp() {
    this.updateCategoriesOptionList();
  }

  // show category section
  toggleAddCategory(e) {
    e.preventDefault();
    categoryForm.classList.remove("hidden");
    toggleCategoryBtn.classList.add("hidden");
  }

  // hide category section
  cancelAddCategory(e) {
    e.preventDefault();
    categoryForm.classList.add("hidden");
    toggleCategoryBtn.classList.remove("hidden");
  }
}

export default new CategoryUI();
