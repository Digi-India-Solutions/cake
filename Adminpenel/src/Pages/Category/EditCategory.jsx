import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    mainCategoryName: "",
  });
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://api.cakecrazzy.com/api/get-single-main-category/${id}`
        );
        const { mainCategoryName, mainCategoryStatus } = response.data.data;
        setCategory({
          mainCategoryName,
        });
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-main-category/${id}`,
        category,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      navigate("/all-category");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error updating category:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Category</h4>
        </div>
        <div className="links">
          <Link to="/all-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="mainCategoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              name="mainCategoryName" // Ensure this matches the backend
              className="form-control"
              id="mainCategoryName"
              value={category.mainCategoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait.." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
