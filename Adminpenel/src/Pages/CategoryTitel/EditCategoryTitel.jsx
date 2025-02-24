import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategoryTitel = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    mainCategoryName: "", // Updated key name
    mainCategoryImage: null, // Updated key name
    mainCategoryStatus: false, // Updated key name
  });
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://api.cakecrazzy.com/api/get-single-main-category/${id}`
        );
        const { mainCategoryName, mainCategoryImage, mainCategoryStatus } =
          response.data.data;
        setCategory({
          mainCategoryName, // Updated key name
          mainCategoryImage, // Updated key name
          mainCategoryStatus: mainCategoryStatus === "True", // Convert to boolean
        });
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const formData = new FormData();
    formData.append("mainCategoryName", category.mainCategoryName); // Ensure this key matches your backend
    if (category.mainCategoryImage) {
      // Ensure this key matches your backend
      formData.append("mainCategoryImage", category.mainCategoryImage); // Ensure this key matches your backend
    }
    formData.append(
      "mainCategoryStatus",
      category.mainCategoryStatus ? "True" : "False"
    ); // Ensure this key matches your backend

    try {
      const response = await axios.put(
        `https://api.cakecrazzy.com/api/update-main-category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      navigate("/all-category");
    } catch (error) {
      toast.error("Error updating category");
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
          <div className="col-md-6">
            <label htmlFor="mainCategoryImage" className="form-label">
              Category Image
            </label>
            <input
              type="file"
              name="mainCategoryImage" // Ensure this matches the backend
              className="form-control"
              id="mainCategoryImage"
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="mainCategoryStatus" // Ensure this matches the backend
                id="mainCategoryStatus"
                checked={category.mainCategoryStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="mainCategoryStatus">
                Active in Homepage
              </label>
            </div>
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

export default EditCategoryTitel;
