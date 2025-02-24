const Color = require("../Model/ColourModel");

// Create a new color
const createColor = async (req, res) => {
    try {
        const { colorName, color, colorStatus } = req.body;

        if (!colorName || !color) {
            return res.status(400).json({
                success: false,
                message: "Color Name and Color are required"
            });
        }

        // Check if a color with the same name already exists
        const existingColor = await Color.findOne({ 
            colorName: { $regex: `^${colorName.trim()}$`, $options: "i" } 
        });

        if (existingColor) {
            return res.status(400).json({
                success: false,
                message: "Color Name already exists"
            });
        }

        const newColor = new Color({
            colorName: colorName.trim(), // Trim whitespace from name
            color,
            colorStatus: colorStatus || "False" // Default to "False" if not provided
        });

        const savedColor = await newColor.save(); // Save the color to the database
        res.status(201).json({
            message: 'Color created successfully',
            data: savedColor
        });
    } catch (error) {
        console.error("Error creating color:", error);
        res.status(500).json({
            message: 'Error creating color',
            error: error.message
        });
    }
};


// Get all colors
const getAllColors = async (req, res) => {
    try {
        const colors = await Color.find(); // Fetch all colors from the database
        res.status(200).json({
            message: 'Colors retrieved successfully',
            data: colors
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching colors',
            error: error.message
        });
    }
};

// Get a single color by ID
const getColorById = async (req, res) => {
    try {
        const { id } = req.params; // Get the color ID from the request parameters
        const color = await Color.findById(id); // Fetch the color by ID

        if (!color) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }

        res.status(200).json({
            message: 'Color retrieved successfully',
            data: color
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching color',
            error: error.message
        });
    }
};

// Update a color by ID
const updateColor = async (req, res) => {
    try {
        const { id } = req.params; // Get the color ID from the request parameters
        const { colorName, color, colorStatus } = req.body; // Extract data from the request body

        // Check if a color with the same name (ignoring case) already exists, excluding the current color
        const existingColor = await Color.findOne({
            colorName: { $regex: `^${colorName.trim()}$`, $options: "i" },
            _id: { $ne: id } // Exclude the current color being updated
        });

        if (existingColor) {
            return res.status(400).json({
                success: false,
                message: "Color Name already exists"
            });
        }

        // Update the color
        const updatedColor = await Color.findByIdAndUpdate(
            id,
            { colorName, color, colorStatus },
            { new: true } // Update and return the new document
        );

        if (!updatedColor) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }

        res.status(200).json({
            message: 'Color updated successfully',
            data: updatedColor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating color',
            error: error.message
        });
    }
};


// Delete a color by ID
const deleteColor = async (req, res) => {
    try {
        const { id } = req.params; // Get the color ID from the request parameters

        const deletedColor = await Color.findByIdAndDelete(id); // Delete the color by ID

        if (!deletedColor) {
            return res.status(404).json({
                message: 'Color not found'
            });
        }

        res.status(200).json({
            message: 'Color deleted successfully',
            data: deletedColor
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting color',
            error: error.message
        });
    }
};

module.exports = {
    createColor,
    getAllColors,
    getColorById,
    updateColor,
    deleteColor
};
