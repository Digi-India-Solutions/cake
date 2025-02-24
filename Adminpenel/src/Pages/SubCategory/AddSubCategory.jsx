import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    subcategoryName: "",
    ActiveonHome: false, // Added ActiveonHome field
    image: null, // Added image field
  });
  const [mainCategories, setMainCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/get-main-category"
        );
        setMainCategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching main categories");
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle file input separately
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] })); // Store the selected file
    }
    // Handle checkbox (ActiveonHome) separately
    else if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    }
    // Handle other inputs
    else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.categoryName || !formData.subcategoryName) {
      toast.error("Category Name and Subcategory Name are required");
      setIsLoading(false);
      return;
    }

    // Validate image upload
    if (!formData.image) {
      toast.error("Subcategory image is required");
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("categoryName", formData.categoryName);
      formDataToSend.append("subcategoryName", formData.subcategoryName);
      formDataToSend.append("ActiveonHome", formData.ActiveonHome);
      formDataToSend.append("image", formData.image); // Append the image file

      // Send the request
      console.log(formDataToSend)
      const response = await axios.post(
        "http://localhost:5000/api/create-subcategory",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-subcategory");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding subcategory");
      console.error("Error adding subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Subcategory</h4>
        </div>
        <div className="links">
          <Link to="/all-subcategory" className="add-new">
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
              Subcategory Name
            </label>
            <input
              type="text"
              name="subcategoryName"
              className="form-control"
              id="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="ActiveonHome" className="form-label">
              Display on Homepage
            </label>
            <div className="form-check">
              <input
                type="checkbox"
                name="ActiveonHome"
                className="form-check-input"
                id="ActiveonHome"
                checked={formData.ActiveonHome}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="ActiveonHome">
                Active on Homepage
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="image" className="form-label">
              Subcategory Image
            </label>
            <input
              type="file"
              name="image"
              className="form-control"
              id="image"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubCategory;