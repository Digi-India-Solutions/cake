import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from 'jodit-react';

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const navigate = useNavigate()
    const editor = useRef(null);
    console.log(id);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: "",
        subcategoryName: "",
        productName: "",
        productDescription: "",
        Variant: [
            {
                weight: "",
                price: "",
                discountPrice: "",
                finalPrice: "",
                stock: "",
            },
        ],
        productImage: [],
    });

    // State to store dynamic data
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [weights, setWeights] = useState([]);


    // State to store filtered subcategories
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);



    // Fetch product details and dynamic data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic data
                const categoryResponse = await axios.get(
                    "https://api.cakecrazzy.com/api/get-main-category"
                );
                const subcategoryResponse = await axios.get(
                    "https://api.cakecrazzy.com/api/get-subcategory"
                );
                const weightResponse = await axios.get(
                    "https://api.cakecrazzy.com/api/get-size"
                );
                setCategories(categoryResponse.data.data);
                setSubcategories(subcategoryResponse.data.data);
                setWeights(weightResponse.data.data);

                // Fetch product details
                const productResponse = await axios.get(
                    `https://api.cakecrazzy.com/api/get-single-product/${id}`
                );
                const productData = productResponse.data.data;
                setFormData({
                    ...productData,
                    categoryName: productData.categoryName ? productData.categoryName._id : "",
                    subcategoryName: productData.subcategoryName ? productData.subcategoryName._id : "",
                    Variant: productData.Variant || [],
                    productImage: [], // Reset images for new uploads
                });
            } catch (error) {
                console.error("Error fetching data", error);
                toast.error("Error loading data!");
            }
        };

        fetchData();
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // If categoryName changes, filter subcategories
        if (name === 'categoryName') {
            const filteredSubcategories = subcategories.filter(
                (subcategory) => subcategory.categoryName._id === value
            );
            setFilteredSubcategories(filteredSubcategories);
        }
    };


    // Handle file change for images
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            productImage: e.target.files,
        });
    };

    // Update formData when editor content changes
    const handleEditorChange = (newContent) => {
        setFormData({ ...formData, productDescription: newContent });
    };

    // Handle variant change
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target; // Get the field name and value
        const updatedVariants = [...formData.Variant]; // Clone the variants array

        // Update the specific field of the variant
        updatedVariants[index][name] = value;

        // Automatically calculate finalPrice when price or discountPrice changes
        if (name === 'price' || name === 'discountPrice') {
            const price = parseFloat(updatedVariants[index].price) || 0;
            const discount = parseFloat(updatedVariants[index].discountPrice) || 0;

            updatedVariants[index].finalPrice = price - (price * (discount / 100));
        }

        setFormData({
            ...formData,
            Variant: updatedVariants, // Update the state
        });
    };

    // Add new variant
    const handleAddVariant = () => {
        setFormData({
            ...formData,
            Variant: [
                ...formData.Variant,
                {
                    weight: "",
                    flover: "",
                    price: "",
                    discountPrice: "",
                    finalPrice: "",
                    stock: "",
                    eggLess: false,
                },
            ],
        });
    };

    // Remove variant
    const handleRemoveVariant = (index) => {
        const updatedVariants = formData.Variant.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            Variant: updatedVariants,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const form = new FormData();
        form.append("categoryName", formData.categoryName);
        form.append("subcategoryName", formData.subcategoryName);
        form.append("productName", formData.productName);
        form.append("productDescription", formData.productDescription);

        // Append variants
        form.append("Variant", JSON.stringify(formData.Variant));

        // Append new images
        for (let i = 0; i < formData.productImage.length; i++) {
            form.append("productImage", formData.productImage[i]);
        }

        try {
            await axios.put(`https://api.cakecrazzy.com/api/update-product/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Product updated successfully!");
            navigate("/all-products")
        } catch (err) {
            console.log(err)
            // toast.error(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Product</h4>
                </div>
                <div className="links">
                    <Link to="/all-products" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-3">
                        <label htmlFor="categoryName" className="form-label">Category Name<sup className="text-danger">*</sup></label>
                        <select name="categoryName" className="form-select" id="categoryName" value={formData.categoryName} onChange={handleChange}>
                            <option value="" disabled>Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item._id}>
                                    {item.mainCategoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="subcategoryName" className="form-label">Subcategory Name<sup className="text-danger">*</sup></label>
                        <select
                            name="subcategoryName"
                            className="form-select"
                            id="subcategoryName"
                            value={formData.subcategoryName}
                            onChange={handleChange}
                        // required
                        >
                            <option value="" selected disabled>Select Subcategory</option>
                            {filteredSubcategories.map((item, index) => (
                                <option key={index} value={item._id}>{item.subcategoryName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="productName" className="form-label">Product Name<sup className="text-danger">*</sup></label>
                        <input type="text" name='productName' className="form-control" id="productName" value={formData.productName} onChange={handleChange} required />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="productDescription" className="form-label">Product Description<sup className="text-danger">*</sup></label>
                        {/* <textarea name='productDescription' rows={6} className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} required /> */}
                        <JoditEditor
                            ref={editor}
                            value={formData.productDescription}
                            onChange={handleEditorChange}
                            placeholder="Enter Product Description here..."
                        />
                    </div>

                    <div className="col-md-8">
                        <label htmlFor="productImage" className="form-label">Product Images<sup className="text-danger">*</sup></label>
                        <input type="file" className="form-control" id="productImage" name="productImage" multiple onChange={handleFileChange} />
                    </div>

                    {/* Variant Fields */}
                    <div className="col-md-12">
                        {/* <label className="form-label">Product Variants<sup className="text-danger">*</sup></label> */}
                        {formData.Variant.map((variant, index) => (
                            <div key={index} className="variant-container">
                                <div className="row">
                                    <div className="col-md-3 mb-1">
                                        <label htmlFor={`weight-${index}`} className="form-label">Weight/Sizes<sup className="text-danger">*</sup></label>
                                        <select
                                            name="weight"
                                            className="form-select"
                                            id={`weight-${index}`}
                                            value={variant.weight} // Link to the specific variant's weight
                                            onChange={(e) => handleVariantChange(index, e)}
                                        >
                                            <option value="" disabled>Select Weight</option>
                                            {weights.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.sizeweight}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* <div className="col-md-3 mb-1">
                                        <label htmlFor={`stock-${index}`} className="form-label">Stock<sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className="form-control"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div> */}

                                    <div className="col-md-3">
                                        <label htmlFor={`price-${index}`} className="form-label">Price<sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            name="price"
                                            className="form-control"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label htmlFor={`discountPrice-${index}`} className="form-label">Discount Price<sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            name="discountPrice"
                                            className="form-control"
                                            value={variant.discountPrice}
                                            onChange={(e) => handleVariantChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label htmlFor={`finalPrice-${index}`} className="form-label">Final Price<sup className='text-danger'>*</sup></label>
                                        <input
                                            type="number"
                                            name="finalPrice"
                                            className="form-control"
                                            value={variant.finalPrice}
                                            readOnly // Make the field read-only
                                        />
                                    </div>
                                </div>

                                <button type="button" className="btn btn-danger mt-2" onClick={() => handleRemoveVariant(index)}>Remove Variant</button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-primary mt-2" onClick={handleAddVariant}>Add Variant</button>
                    </div>

                    <div className="col-md-12 text-center">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
