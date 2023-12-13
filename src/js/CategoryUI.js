import Storage from "./Storage.js";

const categoryTitle = document.querySelector("#category_title");
const categoryDesc = document.querySelector("#category_desc");
const addNewCategoryBtn = document.querySelector("#add_new_category_btn");

class CategoryUI {
  constructor() {
    addNewCategoryBtn.addEventListener("click", (e) => this.addNewCategory(e));
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
    this.categories = Storage.getAllCategories();
    this.createCategoriesOptionList();
  }

  // set app for initial render
  setupApp() {
    this.updateCategoriesOptionList();
  }
}

export default new CategoryUI();
