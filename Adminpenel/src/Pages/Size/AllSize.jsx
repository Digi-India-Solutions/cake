import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllSize = () => {
  const [sizes, setSizes] = useState([]); // State to store size data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get("https://api.cakecrazzy.com/api/get-size"); // Adjust the URL for fetching sizes
        if (response.data && response.data.data) {
          setSizes(response.data.data); // Set the fetched sizes
        } else {
          toast.error("No sizes found");
        }
      } catch (error) {
        toast.error(
          error.response ? error.response.data.message : "Error fetching sizes"
        );
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchSizes(); // Call the fetch function
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
          `https://api.cakecrazzy.com/api/delete-size/${id}`
        ); // Adjust the delete URL
        toast.success(response.data.message);
        setSizes(sizes.filter((size) => size._id !== id)); // Remove deleted size from state
      } catch (error) {
        toast.error(
          error.response ? error.response.data.message : "Error deleting size"
        );
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Sizes</h4>
        </div>
        <div className="links">
          <Link to="/add-size" className="add-new">
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
              <th scope="col">Size (Weight)</th>
              <th scope="col">Size Status</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : sizes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No sizes available
                </td>
              </tr>
            ) : (
              sizes.map((size, index) => (
                <tr key={size._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{size.sizeweight}</td> {/* Display size weight */}
                  <td>{size.sizeStatus}</td> {/* Display size status */}
                  <td>
                    <Link to={`/edit-size/${size._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(size._id)}
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

export default AllSize;
