const { createSubcategory, getAllSubcategories, getSubcategoryById, updateSubcategory, deleteSubcategory, getAllSubcategoriesStatusTrue, getSubcategoryByName,getActiveSubcategories } = require("../Controller/SubcategoryController");
const upload = require("../MiddleWare/Multer");

const SubcCategoryRouter = require("express").Router()

SubcCategoryRouter.post("/create-subcategory", upload.single('image'), createSubcategory);
SubcCategoryRouter.get("/get-subcategory", getAllSubcategories);
SubcCategoryRouter.get("/get-getActiveSubcategories", getActiveSubcategories);
SubcCategoryRouter.get("/get-subcategory-by-status", upload.single('image'),getAllSubcategoriesStatusTrue);// new added
SubcCategoryRouter.get("/get-single-subcategory/:id", getSubcategoryById);
SubcCategoryRouter.get("/get-subcategory-by-name/:name", getSubcategoryByName);
SubcCategoryRouter.put("/update-subcategory/:id", upload.single('image'), updateSubcategory);
SubcCategoryRouter.delete("/delete-subcategory/:id", deleteSubcategory);


module.exports = SubcCategoryRouter