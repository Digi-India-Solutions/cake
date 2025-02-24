import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    mainCategoryName: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    // console.log(formData);
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/create-main-category",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-category");
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
          <h4>Add Category</h4>
        </div>
        <div className="links">
          <Link to="/all-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="mainCategoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              name="mainCategoryName"
              className="form-control"
              id="mainCategoryName"
              value={formData.mainCategoryName}
              onChange={handleChange}
              required
              placeholder="Category Name"
            />
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

export default AddCategory;
