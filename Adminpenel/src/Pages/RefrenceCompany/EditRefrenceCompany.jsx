import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRefrenceCompany = () => {
  const { id } = useParams(); // Get the reference company ID from the URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [refCompanyData, setRefCompanyData] = useState({
    refCompanyName: "",
  });
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchRefCompany = async () => {
      try {
        const response = await axios.get(
          `https://api.cakecrazzy.com/api/ref-company/${id}`
        ); // Adjusted endpoint
        //console.log(response);
        if (response.data && response.data.data) {
          setRefCompanyData({
            refCompanyName: response.data.data.refCompanyName || "", // Ensure it matches the API response
          });
        } else {
          toast.error("Reference Company data not found");
        }
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.message
            : "Error fetching reference company data"
        );
      }
    };

    fetchRefCompany(); // Call the function to fetch data
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRefCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true); // Set loading state to true

    try {
      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-ref-company/${id}`,
        refCompanyData
      ); // Adjusted endpoint
      toast.success(response.data.message); // Show success message
      navigate("/all-ref-companies"); // Redirect to the list page
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data.message
          : "Error updating reference company"
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
          <h4>Edit Reference Company</h4>
        </div>
        <div className="links">
          <Link to="/all-ref-companies" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="refCompanyName" className="form-label">
              Reference Company Name
            </label>
            <input
              type="text"
              name="refCompanyName"
              className="form-control"
              id="refCompanyName"
              value={refCompanyData.refCompanyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={btnLoading}
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
            >
              {btnLoading ? "Please Wait..." : "Update Reference Company"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditRefrenceCompany;
