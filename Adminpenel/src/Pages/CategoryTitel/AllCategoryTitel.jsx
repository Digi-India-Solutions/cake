import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllCategoryTitel = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-main-category"
        );
        setCategories(response.data.data); // assuming the data is in response.data.data
        // toast.success(response.data.message);
      } catch (error) {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(
          `https://api.cakecrazzy.com/api/delete-main-category/${id}`
        );
        setCategories(categories.filter((category) => category._id !== id));
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was an error deleting the category.",
          "error"
        );
        console.error("Error deleting category:", error);
      }
    }
  };

  if (isLoading) {
    return <p>Loading categories...</p>; // Loading state
  }

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Category List</h4>
        </div>
        <div className="links">
          <Link to="/add-category-titel" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="filteration">
        <div className="selects">
          {/* <select>
                        <option>Ascending Order</option>
                        <option>Descending Order</option>
                    </select> */}
        </div>
        <div className="search">
          <label htmlFor="search">Search</label> &nbsp;
          <input type="text" name="search" id="search" />
        </div>
      </div>

      <section className="main-table ">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Show in home page</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{category.mainCategoryName}</td>
                  <td>
                    <img
                      src={`https://api.cakecrazzy.com/${category.mainCategoryImage}`}
                      alt={category.mainCategoryName}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>
                    {category.mainCategoryStatus === "True" ? "Yes" : "No"}
                  </td>
                  <td>
                    <Link
                      to={`/edit-category/${category._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      className="bt delete"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllCategoryTitel;
