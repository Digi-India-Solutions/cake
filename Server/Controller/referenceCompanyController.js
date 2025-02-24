const RefrenceCompany = require("../Model/RefrenceCompanyModel");


const createRefCompany = async (req, res) => {
    try {
        const { refCompanyName } = req.body;

        // Validate input
        if (!refCompanyName) {
            return res.status(400).json({ message: "Reference company name is required" });
        }

        // Check if the reference company with the same name already exists (case-insensitive)
        const existingRefCompany = await RefrenceCompany.findOne({
            refCompanyName: { $regex: `^${refCompanyName.trim()}$`, $options: 'i' }
        });

        if (existingRefCompany) {
            return res.status(400).json({
                message: "Reference company with this name already exists"
            });
        }

        const newRefCompany = new RefrenceCompany({ refCompanyName });
        await newRefCompany.save();

        res.status(201).json({
            message: "Reference company created successfully",
            data: newRefCompany,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating reference company", error: error.message });
    }
};


// Get all reference companies
const getAllRefCompanies = async (req, res) => {
    try {
        const refCompanies = await RefrenceCompany.find();
        res.status(200).json({
            message: "Reference companies retrieved successfully",
            data: refCompanies,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reference companies", error: error.message });
    }
};

// Get a single reference company by ID
const getSingleRefCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const refCompany = await RefrenceCompany.findById(id);
        if (!refCompany) {
            return res.status(404).json({ message: "Reference company not found" });
        }

        res.status(200).json({
            message: "Reference company retrieved successfully",
            data: refCompany,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching reference company", error: error.message });
    }
};

// Update a reference company by ID
const updateRefCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { refCompanyName } = req.body;

        // Validate input
        if (!refCompanyName) {
            return res.status(400).json({ message: "Reference company name is required" });
        }

        // Check if the new company name already exists (case-insensitive)
        const existingRefCompany = await RefrenceCompany.findOne({
            refCompanyName: { $regex: `^${refCompanyName.trim()}$`, $options: 'i' },
            _id: { $ne: id } // Exclude the current company being updated
        });

        if (existingRefCompany) {
            return res.status(400).json({
                message: "Reference company with this name already exists"
            });
        }

        const updatedRefCompany = await RefrenceCompany.findByIdAndUpdate(
            id,
            { refCompanyName },
            { new: true } // Return the updated document
        );

        if (!updatedRefCompany) {
            return res.status(404).json({ message: "Reference company not found" });
        }

        res.status(200).json({
            message: "Reference company updated successfully",
            data: updatedRefCompany,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating reference company", error: error.message });
    }
};


// Delete a reference company by ID
const deleteRefCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRefCompany = await RefrenceCompany.findByIdAndDelete(id);

        if (!deletedRefCompany) {
            return res.status(404).json({ message: "Reference company not found" });
        }

        res.status(200).json({
            message: "Reference company deleted successfully",
            data: deletedRefCompany,
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting reference company", error: error.message });
    }
};

module.exports = {
    createRefCompany,
    getAllRefCompanies,
    getSingleRefCompany,
    updateRefCompany,
    deleteRefCompany,
};
