import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddShopBanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    customer: "",
    mobileNumber: "",
    services: [], // Keep services as an array
    totalAmount: "",
    reciveAmount: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "services" ? value.split(",") : value, // Parse services as comma-separated values
    }));
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/send-sale",
        data,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });

      if (!blob) {
        throw new Error("Failed to create a PDF blob");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sale-invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Sale added successfully! PDF is ready.");
      navigate("/all-banners");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "Failed to add sale. Please try again."
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
          <h4>Add Sale</h4>
        </div>
        <div className="links">
          <Link to="/all-banners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="customer" className="form-label">
              Customer
            </label>
            <input
              type="text"
              className="form-control"
              id="customer"
              name="customer"
              value={data.customer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="mobileNumber" className="form-label">
              Mobile Number
            </label>
            <input
              type="text"
              className="form-control"
              id="mobileNumber"
              name="mobileNumber"
              value={data.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="services" className="form-label">
              Services (comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              id="services"
              name="services"
              value={data.services.join(",")} // Display services as a comma-separated string
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="totalAmount" className="form-label">
              Total Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="totalAmount"
              name="totalAmount"
              value={data.totalAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="reciveAmount" className="form-label">
              Receive Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="reciveAmount"
              name="reciveAmount"
              value={data.reciveAmount}
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
              {isLoading ? "Please Wait..." : "Add Sale"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddShopBanner;
