import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditInnerSubCategory = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    subcategoryName: "",
    innerSubcategoryName: "",
    innersubcategoryStatus: "False",
    Image: null,
  });
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch main categories
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

    // Fetch subcategories
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

    // Fetch the inner subcategory details for editing
    const fetchInnerSubCategoryDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.cakecrazzy.com/api/single-inner-subcategory/${id}`
        );
        const data = response.data.data;
        setFormData({
          categoryName: data.categoryName._id,
          subcategoryName: data.subcategoryName._id,
          innerSubcategoryName: data.innerSubcategoryName,
          innersubcategoryStatus: data.innersubcategoryStatus,
          Image: null, // You might want to keep track of the image URL here if needed
        });
        // Filter subcategories based on the selected category
        filterSubCategories(data.categoryName._id);
      } catch (error) {
        toast.error("Error fetching inner subcategory details");
        console.error("Error fetching inner subcategory details:", error);
      }
    };

    fetchMainCategories();
    fetchSubCategories();
    fetchInnerSubCategoryDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Image") {
      setFormData((prevData) => ({ ...prevData, Image: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      if (name === "categoryName") {
        // Filter subcategories when category is changed
        filterSubCategories(value);
      }
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      innersubcategoryStatus:
        prevData.innersubcategoryStatus === "True" ? "False" : "True",
    }));
  };

  const filterSubCategories = (categoryId) => {
    // Filter subcategories that match the selected category
    const filtered = subCategories.filter(
      (subcategory) => subcategory.categoryName._id === categoryId
    );
    setFilteredSubCategories(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("categoryName", formData.categoryName);
    data.append("subcategoryName", formData.subcategoryName);
    data.append("innerSubcategoryName", formData.innerSubcategoryName);
    data.append("innersubcategoryStatus", formData.innersubcategoryStatus);
    if (formData.Image) data.append("Image", formData.Image);

    try {
      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-inner-subcategory/${id}`,
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
        error.response?.data?.message || "Error updating inner subcategory"
      );
      console.error("Error updating inner subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Inner Subcategory</h4>
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
              <option value="" disabled>
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
              Select Subcategory
            </label>
            <select
              name="subcategoryName"
              className="form-control"
              id="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              // required
            >
              <option value="" disabled>
                Select a subcategory
              </option>
              {filteredSubCategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.subcategoryName}
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
              {isLoading ? "Please Wait..." : "Update Inner Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditInnerSubCategory;
