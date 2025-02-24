import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryTitel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
    categoryStatus: "False",
    categories: [], // This will store selected category IDs
  });
  const [categoriesList, setCategoriesList] = useState([]); // List of categories fetched from the API
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the API on component mount
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-main-category"
        );
        if (response.data && response.data.data) {
          setCategoriesList(response.data.data); // Set fetched categories
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, categoryImage: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      categoryStatus: prevData.categoryStatus === "True" ? "False" : "True",
    }));
  };

  const handleCategoryChange = (e) => {
    // Update the categories array when categories are selected
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedCategories,
    }));
  };

  const handleRemoveCategory = (categoryId) => {
    // Remove category from the selected categories list and add it back to the select dropdown
    setFormData((prevData) => {
      const updatedCategories = prevData.categories.filter(
        (id) => id !== categoryId
      );
      return { ...prevData, categories: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const uploadData = new FormData();
    uploadData.append("mainCategoryName", formData.categoryName);
    uploadData.append("mainCategoryImage", formData.categoryImage);
    uploadData.append("mainCategoryStatus", formData.categoryStatus);
    uploadData.append("categories", JSON.stringify(formData.categories)); // Append selected categories

    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/create-main-category",
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-category-titel"); // Redirect to the category list
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Category Titel</h4>
        </div>
        <div className="links">
          <Link to="/all-category-titel" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              className="form-control"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="categoryImage" className="form-label">
              Category Image
            </label>
            <input
              type="file"
              name="categoryImage"
              className="form-control"
              id="categoryImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="categories" className="form-label">
              Categories
            </label>
            <select
              name="categories"
              id="categories"
              className="form-control"
              multiple
              value={formData.categories}
              onChange={handleCategoryChange}
              required
            >
              {categoriesList.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.mainCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <div className="selected-categories">
              {/* Display selected categories */}
              {formData.categories.map((categoryId) => {
                const category = categoriesList.find(
                  (c) => c._id === categoryId
                );
                return category ? (
                  <div key={categoryId} className="selected-category-item">
                    <span>{category.mainCategoryName}</span>
                    <button
                      type="button"
                      className="remove-category-btn"
                      onClick={() => handleRemoveCategory(categoryId)}
                    >
                      &times;
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="categoryActive"
                id="categoryActive"
                checked={formData.categoryStatus === "True"}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="categoryActive">
                Active in Homepage
              </label>
            </div>
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCategoryTitel;
