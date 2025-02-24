const Size = require("../Model/SizeModel");


// Create a new size
const createSize = async (req, res) => {
    try {
        const { sizeweight, sizeStatus } = req.body;

        // Check if sizeweight is provided
        if (!sizeweight) {
            return res.status(400).json({
                success: false,
                message: "Size is must required"
            });
        }

        // Check if the sizeweight already exists (ignoring case)
        const existingSize = await Size.findOne({
            sizeweight: { $regex: `^${sizeweight.trim()}$`, $options: 'i' }
        });

        if (existingSize) {
            return res.status(400).json({
                success: false,
                message: "Size already exists"
            });
        }

        // Create the new size
        const newSize = new Size({
            sizeweight,
            sizeStatus: sizeStatus || "False" // Default to "False" if not provided
        });

        await newSize.save(); // Save the size to the database

        res.status(201).json({ message: "Size created successfully", data: newSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating size", error: error.message });
    }
};


// Get all sizes
const getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.find();
        res.status(200).json({ message: "Sizes retrieved successfully", data: sizes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving sizes", error: error.message });
    }
};

// Get a single size by ID
const getSingleSize = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);
        if (!size) {
            return res.status(404).json({ message: "Size not found" });
        }
        res.status(200).json({ message: "Size retrieved successfully", data: size });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving size", error: error.message });
    }
};

// Update a size by ID
const updateSize = async (req, res) => {
    try {
        const { sizeweight, sizeStatus } = req.body;
        const { id } = req.params;

        // Check if the sizeweight already exists (excluding the current size being updated)
        const existingSize = await Size.findOne({
            sizeweight: { $regex: `^${sizeweight.trim()}$`, $options: 'i' },
            _id: { $ne: id } // Exclude the current size document
        });

        if (existingSize) {
            return res.status(400).json({
                success: false,
                message: "Size with this weight already exists"
            });
        }

        // Proceed with the update
        const updatedSize = await Size.findByIdAndUpdate(
            id,
            { sizeweight, sizeStatus },
            { new: true, runValidators: true } // Returns the updated document
        );

        if (!updatedSize) {
            return res.status(404).json({ message: "Size not found" });
        }

        res.status(200).json({ message: "Size updated successfully", data: updatedSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating size", error: error.message });
    }
};

// Delete a size by ID
const deleteSize = async (req, res) => {
    try {
        const deletedSize = await Size.findByIdAndDelete(req.params.id);
        if (!deletedSize) {
            return res.status(404).json({ message: "Size not found" });
        }
        res.status(200).json({ message: "Size deleted successfully", data: deletedSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting size", error: error.message });
    }
};

module.exports = {
    createSize,
    getAllSizes,
    getSingleSize,
    updateSize,
    deleteSize
};
