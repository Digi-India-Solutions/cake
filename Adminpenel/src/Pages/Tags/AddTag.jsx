import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTag = () => {
  const [formData, setFormData] = useState({
    tagName: "",
    tagColor: "#000000",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send POST request to the backend
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/add-tags",
        formData
      );

      // Show success message
      toast.success("Tag added successfully!");
      setIsLoading(false);
      navigate("/all-tags"); // Redirect to the page showing all tags
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Tag</h4>
        </div>
        <div className="links">
          <Link to="/all-tags" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              Tag Name
            </label>
            <input
              type="text"
              name="tagName"
              className="form-control"
              id="title"
              value={formData.tagName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="TagColour" className="form-label">
              Tag Color
            </label>
            <input
              type="color"
              name="tagColor"
              className="form-control"
              id="TagColour"
              value={formData.tagColor}
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
              {isLoading ? "Please Wait..." : "Add Tag"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTag;
