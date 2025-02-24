import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllRefrenceCompany = () => {
  const [companies, setCompanies] = useState([]); // State to store company data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/all-ref-companies"
        ); // Adjust the API endpoint
        if (response.data && response.data.data) {
          setCompanies(response.data.data); // Set the fetched reference companies
        } else {
          toast.error("No reference companies found");
        }
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.message
            : "Error fetching reference companies"
        );
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchCompanies(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://api.cakecrazzy.com/api/delete-ref-company/${id}`
        ); // Adjust the delete URL
        toast.success(response.data.message);
        setCompanies(companies.filter((company) => company._id !== id)); // Remove deleted company from state
      } catch (error) {
        toast.error(
          error.response
            ? error.response.data.message
            : "Error deleting reference company"
        );
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Reference Companies</h4>
        </div>
        <div className="links">
          <Link to="/add-ref-company" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input type="text" name="search" id="search" />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Reference Company Name</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No reference companies available
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr key={company._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{company.refCompanyName}</td>{" "}
                  {/* Display reference company name */}
                  <td>
                    <Link
                      to={`/edit-ref-company/${company._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllRefrenceCompany;
