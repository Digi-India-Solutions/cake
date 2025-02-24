import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSize = () => {
  const { id } = useParams(); // Get the size ID from the URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [sizeData, setSizeData] = useState({
    sizeweight: "",
    sizeStatus: false, // Use boolean for checkbox state
  });
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const response = await axios.get(
          `https://api.cakecrazzy.com/api/get-single-size/${id}`
        ); // Adjust the endpoint for sizes
        // Convert sizeStatus to boolean for easier handling
        setSizeData({
          ...response.data.data,
          sizeStatus: response.data.data.sizeStatus === "True", // Assuming the API returns "True" or "False" as strings
        });
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.message
            : "Error fetching size data"
        );
      }
    };

    fetchSize(); // Call the function to fetch size data
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSizeData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true); // Set loading state to true

    // Convert sizeStatus back to string for the API request
    const updatedData = {
      ...sizeData,
      sizeStatus: sizeData.sizeStatus ? "True" : "False", // Convert boolean back to string
    };

    try {
      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-size/${id}`,
        updatedData
      ); // Adjust the update endpoint
      toast.success(response.data.message); // Show success message
      navigate("/all-size"); // Redirect to the all sizes page
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "Error updating size"
      );
    } finally {
      setBtnLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Size</h4>
        </div>
        <div className="links">
          <Link to="/all-size" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="sizeWeight" className="form-label">
              Size Weight
            </label>
            <input
              type="text"
              name="sizeweight"
              className="form-control"
              id="sizeWeight"
              value={sizeData.sizeweight}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="sizeStatus" className="form-label">
              Active
            </label>
            <input
              type="checkbox"
              name="sizeStatus"
              className="form-check-input"
              id="sizeStatus"
              checked={sizeData.sizeStatus}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={btnLoading}
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
            >
              {btnLoading ? "Please Wait..." : "Update Size"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditSize;
