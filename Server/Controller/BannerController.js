const fs = require("fs");
const path = require("path");
const Banner = require("../Model/BannerModel");


const deleteImageFile = (relativeFilePath) => {
    const absolutePath = path.join(__dirname, "..", relativeFilePath);
    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        } else {
            console.log("Image deleted:", absolutePath);
        }
    });
};

const createBanner = async (req, res) => {
    console.log(req.body)
    try {
        const { bannerName, bannerType, bannerStatus } = req.body;
        const errorMessage = [];
        if (!bannerName) errorMessage.push("Banner Name is required");
        if (!bannerType) errorMessage.push("Banner Type is required");
        if (!req.file) errorMessage.push("Banner Image is required");

        if (errorMessage.length) {
            if (req.file) fs.unlinkSync(req.file.path); // Remove uploaded image if validation fails
            return res.status(400).json({ success: false, message: errorMessage.join(", ") });
        }

        const banner = new Banner({
            bannerName,
            bannerImage: req.file.path, // Save the file path
            bannerType,
            bannerStatus: bannerStatus || "False",
        });
        await banner.save();
        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Delete image if there’s an error during saving
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { bannerName, bannerType, bannerStatus } = req.body;
        const banner = await Banner.findById(id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

        // Delete old image if a new one is uploaded
        if (req.file && banner.bannerImage) {
            deleteImageFile(banner.bannerImage);
            banner.bannerImage = req.file.path;
        }

        // Update banner details
        banner.bannerName = bannerName || banner.bannerName;
        banner.bannerType = bannerType || banner.bannerType;
        banner.bannerStatus = bannerStatus || banner.bannerStatus;

        await banner.save();
        res.status(200).json({ success: true, data: banner });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path); // Delete new image if there’s an error
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });

        // Delete the image file
        if (banner.bannerImage) deleteImageFile(banner.bannerImage);

        res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
};