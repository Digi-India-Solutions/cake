import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sizeweight: "", // Updated to match the Size model
    sizeStatus: "False", // Default status
  });
  const navigate = useNavigate(); // To programmatically navigate after adding a size

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field in the formData object
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      sizeStatus: prevData.sizeStatus === "True" ? "False" : "True", // Toggle status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setIsLoading(true); // Set loading state

    try {
      // Send a POST request to add the size
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/create-size",
        formData
      ); // Adjust the URL as needed
      toast.success(response.data.message);
      navigate("/all-size"); // Redirect to the all sizes page
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Error adding size"
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Size</h4>
        </div>
        <div className="links">
          <Link to="/all-size" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="sizeweight" className="form-label">
              Size Weight
            </label>
            <input
              type="text"
              name="sizeweight" // Updated to match the Size model
              className="form-control"
              id="sizeweight"
              value={formData.sizeweight}
              onChange={handleChange} // Use the handleChange method
              required // Mark as required
            />
          </div>
          <div className="col-md-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="sizeStatus"
                checked={formData.sizeStatus === "True"} // Check the checkbox based on the sizeStatus
                onChange={handleCheckboxChange} // Use the handleCheckboxChange method
              />
              <label className="form-check-label" htmlFor="sizeStatus">
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
              {isLoading ? "Please Wait..." : "Add Size"}{" "}
              {/* Updated button text */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSize;
