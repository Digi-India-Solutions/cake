const CategoryTitel = require("../Model/CategoryTitelModel");

// CREATE - Add a new Category Title
const createCategoryTitel = async (req, res) => {
    try {
        const { titelName, titelImage, categories } = req.body;

        // Create new CategoryTitel document
        const newCategoryTitel = new CategoryTitel({
            titelName,
            titelImage,
            categories
        });

        // Save the document to the database
        const savedCategoryTitel = await newCategoryTitel.save();
        res.status(201).json({
            message: 'Category Title created successfully',
            categoryTitel: savedCategoryTitel
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ - Get all Category Titles
const getAllCategoryTitels = async (req, res) => {
    try {
        const categoryTitels = await CategoryTitel.find();
        res.status(200).json(categoryTitels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// READ - Get a single Category Title by ID
const getCategoryTitelById = async (req, res) => {
    try {
        const categoryTitel = await CategoryTitel.findById(req.params.id);

        if (!categoryTitel) {
            return res.status(404).json({ message: 'Category Title not found' });
        }

        res.status(200).json(categoryTitel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// UPDATE - Update an existing Category Title by ID
const updateCategoryTitel = async (req, res) => {
    try {
        const { titelName, titelImage, categories } = req.body;

        // Find and update the CategoryTitle
        const updatedCategoryTitel = await CategoryTitel.findByIdAndUpdate(
            req.params.id,
            { titelName, titelImage, categories },
            { new: true }
        );

        if (!updatedCategoryTitel) {
            return res.status(404).json({ message: 'Category Title not found' });
        }

        res.status(200).json({
            message: 'Category Title updated successfully',
            categoryTitel: updatedCategoryTitel
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE - Delete a Category Title by ID
const deleteCategoryTitel = async (req, res) => {
    try {
        const deletedCategoryTitel = await CategoryTitel.findByIdAndDelete(req.params.id);

        if (!deletedCategoryTitel) {
            return res.status(404).json({ message: 'Category Title not found' });
        }

        res.status(200).json({
            message: 'Category Title deleted successfully',
            categoryTitel: deletedCategoryTitel
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createCategoryTitel,
    getAllCategoryTitels,
    getCategoryTitelById,
    updateCategoryTitel,
    deleteCategoryTitel
};
