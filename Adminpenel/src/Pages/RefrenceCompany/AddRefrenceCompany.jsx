import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRefrenceCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    refCompanyName: "", // Matches the schema field
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send POST request to create reference company
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/create-ref-company",
        formData
      );
      toast.success(response.data.message);
      navigate("/all-ref-companies"); // Redirect to the reference companies list page
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error adding reference company"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Reference Company</h4>
        </div>
        <div className="links">
          <Link to="/all-ref-companies" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="refCompanyName" className="form-label">
              Reference Company Name
            </label>
            <input
              type="text"
              name="refCompanyName" // Matches schema field
              className="form-control"
              id="refCompanyName"
              value={formData.refCompanyName}
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
              {isLoading ? "Please Wait..." : "Add Reference Company"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRefrenceCompany;
