const MainCategory = require("../Model/MainCategoryModel");
const Subcategory = require("../Model/SubcategoryModel");;

const createMainCategory = async (req, res) => {
    try {
        console.log("I am hit" , req.body)
        const { mainCategoryName } = req.body;

        if (!mainCategoryName) {
            return res.status(400).json({ message: "Main category name are required." });
        }

        // Convert input name to lowercase for consistent comparison
        const normalizedCategoryName = mainCategoryName.toLowerCase();

        // Check if the category name already exists
        const existingCategory = await MainCategory.findOne({
            mainCategoryName: { $regex: `^${normalizedCategoryName}$`, $options: "i" },
        });
        if (existingCategory) {
            return res.status(400).json({ message: "Main category name already exists." });
        }

        const newCategory = new MainCategory({
            mainCategoryName: normalizedCategoryName,
        });

        await newCategory.save();
        res.status(201).json({ message: "Main Category created successfully", data: newCategory });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error creating main category:", error);
        res.status(500).json({ message: "Error creating main category", error: error.message });
    }
};


const updateMainCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { mainCategoryName} = req.body;

        // Find the category to update
        const category = await MainCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        // Check if the new name already exists (case-insensitive and excludes the current category)
        if (mainCategoryName) {
            const normalizedCategoryName = mainCategoryName.toLowerCase();
            const existingCategory = await MainCategory.findOne({
                mainCategoryName: { $regex: `^${normalizedCategoryName}$`, $options: "i" },
                _id: { $ne: id }, // Exclude the current category
            });

            if (existingCategory) {
                return res.status(400).json({ message: "Main category name already exists." });
            }

            // Update the name with the normalized version
            category.mainCategoryName = normalizedCategoryName;
        }

        await category.save();
        res.status(200).json({ message: "Main Category updated successfully", data: category });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error updating main category:", error);
        res.status(500).json({ message: "Error updating main category", error: error.message });
    }
};



// Delete Main Category
const deleteMainCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MainCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        res.status(200).json({ message: "Main Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting main category:", error);
        res.status(500).json({ message: "Error deleting main category", error: error.message });
    }
};

// Get All Main Categories
const getAllMainCategories = async (req, res) => {
    try {
        const categories = await MainCategory.find();
        res.status(200).json({ message: "Main Categories retrieved successfully", data: categories });
    } catch (error) {
        console.error("Error retrieving main categories:", error);
        res.status(500).json({ message: "Error retrieving main categories", error: error.message });
    }
};

// Get All Main Categories
const getAllMainCategoriesStatusTrue = async (req, res) => {
    try {
        const categories = await MainCategory.find({ mainCategoryStatus: "True" });
        res.status(200).json({ message: "Main Categories retrieved successfully", data: categories });
    } catch (error) {
        console.error("Error retrieving main categories:", error);
        res.status(500).json({ message: "Error retrieving main categories", error: error.message });
    }
};

// Get Single Main Category by ID
const getSingleMainCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await MainCategory.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        res.status(200).json({ message: "Main Category retrieved successfully", data: category });
    } catch (error) {
        console.error("Error retrieving main category:", error);
        res.status(500).json({ message: "Error retrieving main category", error: error.message });
    }
};

// Get Single Main Category by ID
const getSingleMainCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await MainCategory.findOne({ mainCategoryName: name });

        if (!category) {
            return res.status(404).json({ message: "Main Category not found" });
        }

        res.status(200).json({ message: "Main Category retrieved successfully", data: category });
    } catch (error) {
        console.error("Error retrieving main category:", error);
        res.status(500).json({ message: "Error retrieving main category", error: error.message });
    }
};

const getCategoriesWithSubcategories = async (req, res) => {
    try {
        // Fetch all main categories
        const categories = await MainCategory.find();

        // Initialize an array to hold categories with their subcategories
        const categoriesWithSubcategories = [];

        // Loop over each category
        for (const category of categories) {
            // Fetch subcategories related to the current category
            const subcategories = await Subcategory.find({ categoryName: category._id });

            // Transform subcategories to only include subcategoryName and subcategoryImage
            const transformedSubcategories = subcategories.map(subcategory => ({
                subcategoryName: subcategory.subcategoryName,
                subcategoryImage: subcategory.subcategoryImage,
            }));

            // Combine the category and its transformed subcategories into one object
            const categoryWithSubcategories = {
                _id: category._id,  // Retain the category _id
                mainCategoryName: category.mainCategoryName,  // Retain the category name
                subcategories: transformedSubcategories,  // Add the transformed subcategories array
            };

            // Push the combined object into the result array
            categoriesWithSubcategories.push(categoryWithSubcategories);
        }

        // Send the response with the combined data
        res.status(200).json({
            message: "Categories with subcategories retrieved successfully",
            data: categoriesWithSubcategories,
        });
    } catch (error) {
        console.error("Error retrieving categories with subcategories:", error);
        res.status(500).json({
            message: "Error retrieving categories with subcategories",
            error: error.message,
        });
    }
};



module.exports = {
    createMainCategory,
    updateMainCategory,
    deleteMainCategory,
    getAllMainCategories,
    getSingleMainCategory,
    getAllMainCategoriesStatusTrue,
    getSingleMainCategoryByName,
    getCategoriesWithSubcategories
};

