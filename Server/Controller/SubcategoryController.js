const MainCategory = require("../Model/MainCategoryModel");
const Subcategory = require("../Model/SubcategoryModel");


// Create a new subcategory
const createSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, ActiveonHome } = req.body;
    console.log(req.body, req.file);

    // Validate required fields
    if (!categoryName) {
        return res.status(400).json({ success: false, message: "Category Name is required" });
    }
    if (!subcategoryName) {
        return res.status(400).json({ success: false, message: "Sub Category Name is required" });
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Validate ActiveonHome field (must be a boolean)
    // if (ActiveonHome !== undefined && typeof ActiveonHome !== 'boolean') {
    //     return res.status(400).json({ success: false, message: "ActiveonHome must be a boolean" });
    // }

    try {
        // Check if the category ID is valid
        const validCategory = await MainCategory.findById(categoryName);
        if (!validCategory) {
            // Cleanup uploaded file if category ID is invalid
            if (req.file) {
                deleteImageFile(req.file.path); // Assuming you have a function to delete files
            }
            return res.status(404).json({ success: false, message: "Invalid Category Id" });
        }

        // Normalize the subcategory name for consistent comparison
        const normalizedSubcategoryName = subcategoryName.trim().toLowerCase();

        // Check if the subcategory name already exists under the same category
        const existingSubcategory = await Subcategory.findOne({
            categoryName,
            subcategoryName: { $regex: `^${normalizedSubcategoryName}$`, $options: "i" }
        });

        if (existingSubcategory) {
            // Cleanup uploaded file if subcategory name already exists
            if (req.file) {
                deleteImageFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Subcategory name already exists in this category"
            });
        }

        // Create the subcategory
        const subcategory = new Subcategory({
            categoryName,
            subcategoryName: normalizedSubcategoryName,
            image: req.file.path, // Save the path to the uploaded image
            ActiveonHome: ActiveonHome || false, // Default to false if not provided
        });

        await subcategory.save();

        // Update the main category's subcategoryExit field to true
        validCategory.subcategoryExit = true;
        await validCategory.save();

        res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: subcategory
        });
    } catch (error) {
        // Cleanup uploaded file if an error occurs
        if (req.file) {
            deleteImageFile(req.file.path);
        }

        console.error("Error creating subcategory:", error);

        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation error", error: error.message });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid category ID", error: error.message });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error creating subcategory",
            error: error.message
        });
    }
};
// Get all subcategories
const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate("categoryName");
        res.status(200).json({ data: subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

// Get all subcategories
const getAllSubcategoriesStatusTrue = async (req, res) => {
    try {
        // Fetch subcategories where ActiveonHome is true
        const subcategories = await Subcategory.find({ ActiveonHome: true }).populate("categoryName");

        // If no subcategories are found, return a 404 response
        if (!subcategories || subcategories.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No active subcategories found" 
            });
        }

        // Return the subcategories in the response
        res.status(200).json({ 
            success: true, 
            message: "Active subcategories fetched successfully", 
            data: subcategories 
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);

        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid query parameters", 
                error: error.message 
            });
        }

        // Generic server error
        res.status(500).json({ 
            success: false, 
            message: "Error fetching subcategories", 
            error: error.message 
        });
    }
};

// Get a single subcategory by ID
const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

const getSubcategoryByName = async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ subcategoryName: req.params.name }).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

// Update a subcategory by ID and delete the old image if a new one is provided
const updateSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, ActiveonHome } = req.body;

    try {
        // Find the subcategory by ID
        const subcategory = await Subcategory.findById(req.params.id);

        if (!subcategory) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // Normalize subcategory name for comparison
        const normalizedSubcategoryName = subcategoryName?.trim().toLowerCase();

        // Check for duplicate subcategory name in the same category
        if (normalizedSubcategoryName) {
            const existingSubcategory = await Subcategory.findOne({
                _id: { $ne: req.params.id }, // Exclude the current subcategory
                categoryName: categoryName || subcategory.categoryName, // Use updated or existing categoryName
                subcategoryName: { $regex: `^${normalizedSubcategoryName}$`, $options: "i" },
            });

            if (existingSubcategory) {
                return res.status(400).json({
                    success: false,
                    message: "Subcategory name already exists in this category",
                });
            }
        }

        // Validate ActiveonHome field (must be a boolean)
        // if (ActiveonHome !== undefined && typeof ActiveonHome !== 'boolean') {
        //     return res.status(400).json({ success: false, message: "ActiveonHome must be a boolean" });
        // }

        // Update the subcategory with new data
        if (categoryName) subcategory.categoryName = categoryName;
        if (subcategoryName) subcategory.subcategoryName = normalizedSubcategoryName;
        if (ActiveonHome !== undefined) subcategory.ActiveonHome = ActiveonHome;

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete the old image file (optional, based on your requirements)
            if (subcategory.image) {
                deleteImageFile(subcategory.image); // Assuming you have a function to delete files
            }
            // Save the new image path
            subcategory.image = req.file.path;
        }

        await subcategory.save();

        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: subcategory,
        });
    } catch (error) {
        console.error("Error updating subcategory:", error);

        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation error", error: error.message });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid subcategory ID", error: error.message });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error updating subcategory",
            error: error.message,
        });
    }
};

const deleteImageFile = (filePath) => {
    const fs = require('fs');
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        }
    });
};

// Delete a subcategory by ID and delete the associated image
const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Error deleting subcategory", error });
    }
};

const getActiveSubcategories = async (req, res) => {
    try {
        // Fetch subcategories where ActiveonHome is true
        const activeSubcategories = await Subcategory.find({ ActiveonHome: true })
            .populate('categoryName'); // Optionally populate the category details

        // If no active subcategories are found, return a 404 response
        if (!activeSubcategories || activeSubcategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active subcategories found",
            });
        }

        // Return the active subcategories in the response
        res.status(200).json({
            success: true,
            message: "Active subcategories fetched successfully",
            data: activeSubcategories,
        });
    } catch (error) {
        console.error("Error fetching active subcategories:", error);

        // Handle specific errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
                error: error.message,
            });
        }

        // Generic server error
        res.status(500).json({
            success: false,
            message: "Error fetching active subcategories",
            error: error.message,
        });
    }
};

// Export all controller functions
module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
    getAllSubcategoriesStatusTrue, getSubcategoryByName,getActiveSubcategories
};
