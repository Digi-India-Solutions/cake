const fs = require('fs');
const path = require('path');
const Product = require('../Model/ProductModel');
const mongoose = require("mongoose")


// deleteImageFile function to delete images
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


const createProduct = async (req, res) => {
    console.log(req.body);
    const { categoryName, subcategoryName, productName, productDescription, Variant ,ActiveonHome} = req.body;
    const errorMessage = [];

    // Validation for required fields
    if (!categoryName) errorMessage.push("Category Name is required");
    if (!subcategoryName) errorMessage.push("Subcategory Name is required");
    if (!productName) errorMessage.push("Product Name is required");
    if (!productDescription) errorMessage.push("Product Description is required");

    // If there are any missing fields, return an error
    if (errorMessage.length > 0) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path));
        }
        return res.status(400).json({ errors: errorMessage });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({
        productName: { $regex: `^${productName.trim()}$`, $options: 'i' } // Case-insensitive check
    });

    if (existingProduct) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path)); // Cleanup uploaded files if product name is not unique
        }
        return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // If no images are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Product Images are required"
        });
    }

    // Check and parse Variant if it's a string (JSON string)
    let parsedVariant = [];
    try {
        parsedVariant = Array.isArray(Variant) ? Variant : JSON.parse(Variant); // Parse if it's a string
    } catch (error) {
        return res.status(400).json({ message: "Invalid Variant data" });
    }

    // Proceed with creating the product
    const productData = {
        categoryName,
        subcategoryName,
        productName,
        productDescription,
        ActiveonHome,
        Variant: parsedVariant.map(variant => ({
            ...variant,
            weight: variant.weight ? new mongoose.Types.ObjectId(variant.weight) : null,  // Handle empty weight
            flover: variant.flover ? new mongoose.Types.ObjectId(variant.flover) : null   // Handle empty flover
        })),
        productImage: req.files.map(file => file.path), // Save paths to the uploaded images
    };

    try {
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


const getProductsActiveonHome = async(req,res)=>{
    try {
        const products = await Product.find({ActiveonHome:1})
            .populate('categoryName')
            .populate('subcategoryName')
            .populate({
                path: 'Variant.weight',
                model: 'Size',
            })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Read Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryName')
            .populate('subcategoryName')
            .populate({
                path: 'Variant.weight',
                model: 'Size',
            })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
            .populate('categoryName')
            .populate('subcategoryName')
            .populate('Variant.weight')
            .populate('Variant.flover');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProductByname = async (req, res) => {
    const { name } = req.params;
    console.log(name)
    try {
        const product = await Product.findOne({ productName: name }).populate('categoryName')
            .populate('subcategoryName')
            .populate('Variant.weight')
            .populate('Variant.flover');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ data: product });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};


// Get Products By Subcategory Name
const getProductsBySubcategory = async (req, res) => {
    const { subcategoryName } = req.params;  // Expecting a single subcategory name
    console.log('Subcategory name:', subcategoryName);
    try {
        const products = await Product.find()
            .populate('categoryName')
            .populate('subcategoryName')

        const filterProductData = products.filter((x) => x.subcategoryName.subcategoryName === subcategoryName)
        if (!filterProductData || filterProductData.length === 0) {
            return res.status(404).json({ message: 'No products found for the provided subcategory' });
        }

        res.status(200).json({ data: filterProductData });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    // Collect updated data from the request body
    const updatedData = {
        categoryName: req.body.categoryName,
        subcategoryName: req.body.subcategoryName,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        ActiveonHome: req.body.ActiveonHome || 0, // Default to 0 if not provided
        Variant: req.body.Variant ? JSON.parse(req.body.Variant) : [], // Parse Variant if provided, default to empty array
    };

    // If new images are uploaded, add them to the updated data
    if (req.files && req.files.length > 0) {
        updatedData.productImage = req.files.map(file => file.path);
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product name is unique (to avoid updating to an existing product name)
        if (req.body.productName && req.body.productName !== product.productName) {
            const existingProduct = await Product.findOne({
                productName: { $regex: `^${req.body.productName.trim()}$`, $options: 'i' }, // Case-insensitive check
            });

            if (existingProduct) {
                return res.status(400).json({ message: 'Product with this name already exists' });
            }
        }

        // If new images are provided, delete the old ones
        if (req.files && req.files.length > 0) {
            product.productImage.forEach((imagePath) => {
                deleteImageFile(imagePath); // Delete old images from file storage
            });
        }

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        // Return the updated product data in the response
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);

        // Handle specific errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: err.message });
        }

        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product ID', error: err.message });
        }

        // Generic server error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images using the deleteImageFile function
        product.productImage.forEach((imagePath) => {
            deleteImageFile(imagePath); // Use deleteImageFile here
        });

        // Delete the product from the database
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductByname,
    getProductsBySubcategory,
    getProductsActiveonHome
};
