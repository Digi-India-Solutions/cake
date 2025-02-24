import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllInnerSubCategory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [innerSubcategories, setInnerSubcategories] = useState([]);

  useEffect(() => {
    const fetchInnerSubCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-inner-subcategory"
        );
        setInnerSubcategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching inner subcategories");
        console.error("Error fetching inner subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInnerSubCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://api.cakecrazzy.com/api/delete-inner-subcategory/${id}`
        );
        setInnerSubcategories(
          innerSubcategories.filter((subcategory) => subcategory._id !== id)
        );
        toast.success("Inner subcategory deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the inner subcategory");
      console.error("Error deleting inner subcategory:", error);
    }
  };

  if (isLoading) {
    return <p>Loading subcategories...</p>; // Loading state
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Inner SubCategory List</h4>
        </div>
        <div className="links">
          <Link to="/add-innersubcategory" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>S No</th>
              <th>Category Name</th>
              <th>Subcategory Name</th>
              <th>Inner Subcategory Name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {innerSubcategories.map((subcategory, index) => (
              <tr key={subcategory._id}>
                <td>{index + 1}</td>
                <td>{subcategory?.categoryName?.mainCategoryName}</td>
                <td>{subcategory?.subcategoryName?.subcategoryName}</td>
                <td>{subcategory.innerSubcategoryName}</td>
                <td>
                  <img
                    src={`https://api.cakecrazzy.com/${subcategory.Image}`}
                    alt={subcategory.innerSubcategoryName}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{subcategory.innersubcategoryStatus}</td>
                <td>
                  <Link
                    to={`/edit-innersubcategory/${subcategory._id}`}
                    className="bt edit"
                  >
                    Edit <i className="fa-solid fa-pen-to-square"></i>
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(subcategory._id)}
                    className="bt delete"
                  >
                    Delete <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllInnerSubCategory;
