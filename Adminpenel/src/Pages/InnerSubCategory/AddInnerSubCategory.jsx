import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddInnerSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    subcategoryName: "",
    innerSubcategoryName: "",
    innersubcategoryStatus: "False",
    Image: null, // Handle image as file
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-main-category"
        );
        setMainCategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching main categories");
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-subcategory"
        );
        setSubCategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching subcategories");
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0], // Handle file input for images
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // If categoryName changes, filter subcategories
    if (name === "categoryName") {
      const filteredSubcategories = subCategories.filter(
        (subcategory) => subcategory.categoryName._id === value
      );
      setFilteredSubcategories(filteredSubcategories);
    }
  };

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      innersubcategoryStatus:
        prevData.innersubcategoryStatus === "True" ? "False" : "True",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("categoryName", formData.categoryName);
    data.append("subcategoryName", formData.subcategoryName);
    data.append("innerSubcategoryName", formData.innerSubcategoryName);
    data.append("innersubcategoryStatus", formData.innersubcategoryStatus);
    if (formData.Image) data.append("Image", formData.Image); // Appending image file to FormData

    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/create-inner-subcategory",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-inner-subcategory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding inner subcategory"
      );
      console.error("Error adding inner subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Inner Subcategory</h4>
        </div>
        <div className="links">
          <Link to="/all-inner-subcategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryName" className="form-label">
              Select Main Category
            </label>
            <select
              name="categoryName"
              className="form-control"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            >
              <option value="" selected disabled>
                Select a category
              </option>
              {mainCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.mainCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="subcategoryName" className="form-label">
              Subcategory Name
            </label>
            <select
              name="subcategoryName"
              className="form-control"
              id="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              required
            >
              <option value="" selected disabled>
                Select a subcategory
              </option>
              {filteredSubcategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.subcategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="innerSubcategoryName" className="form-label">
              Inner Subcategory Name
            </label>
            <input
              type="text"
              name="innerSubcategoryName"
              className="form-control"
              id="innerSubcategoryName"
              value={formData.innerSubcategoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="Image" className="form-label">
              Subcategory Image
            </label>
            <input
              type="file"
              name="Image"
              className="form-control"
              id="Image"
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="innersubcategoryStatus"
                id="innersubcategoryStatus"
                checked={formData.innersubcategoryStatus === "True"}
                onChange={handleCheckboxChange}
              />
              <label
                className="form-check-label"
                htmlFor="innersubcategoryStatus"
              >
                Active
              </label>
            </div>
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Inner Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInnerSubCategory;
