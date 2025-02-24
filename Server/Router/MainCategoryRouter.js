const express = require("express");
const { createMainCategory, getAllMainCategories, getSingleMainCategory, updateMainCategory, deleteMainCategory, getAllMainCategoriesStatusTrue, getSingleMainCategoryByName, getCategoriesWithSubcategories } = require("../Controller/MainCategoryController");
const MainCategoryRouter = express.Router();


// Define routes
MainCategoryRouter.post("/create-main-category", createMainCategory);
MainCategoryRouter.get("/get-main-category", getAllMainCategories);
MainCategoryRouter.get("/get-category-with-subcategory", getCategoriesWithSubcategories);
MainCategoryRouter.get("/get-main-category-by-status", getAllMainCategoriesStatusTrue);
MainCategoryRouter.get("/get-single-main-category/:id", getSingleMainCategory);
MainCategoryRouter.get("/get-main-category/by-name/:name", getSingleMainCategoryByName);
MainCategoryRouter.put("/update-main-category/:id", updateMainCategory);
MainCategoryRouter.delete("/delete-main-category/:id", deleteMainCategory);

module.exports = MainCategoryRouter;
