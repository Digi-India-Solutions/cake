import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllProductTag = () => {
  const [productTags, setProductTags] = useState([]);

  // Fetch product tags from the API
  useEffect(() => {
    const fetchProductTags = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-producttag"
        ); // Replace with your actual API endpoint
        setProductTags(response.data.data);
        //console.log(response);
      } catch (error) {
        console.error("Error fetching product tags:", error);
      }
    };

    fetchProductTags();
  }, []);

  const deleteProductTag = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://api.cakecrazzy.com/api/delete-producttag/${id}`
          ); // Replace with your actual API endpoint

          // Remove the deleted tag from the state
          setProductTags(productTags.filter((tag) => tag._id !== id));

          Swal.fire(
            "Deleted!",
            "Your product tag has been deleted.",
            "success"
          );
        } catch (error) {
          console.error("Error deleting product tag:", error);
          Swal.fire(
            "Error!",
            "Failed to delete the product tag. Please try again.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Product Tags</h4>
        </div>
        <div className="links">
          <Link to="/add-product-tag" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="mt-2 main-table table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Tag Heading</th>
              <th scope="col">Sort Description</th>
              <th scope="col">Image</th>
              <th scope="col">Multipul Products</th>
              <th scope="col">Price Range</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productTags.length > 0 ? (
              productTags.map((tag) => (
                <tr key={tag._id}>
                  <td>{tag.tagHeading}</td>
                  <td>{tag.sortDescription}</td>
                  <td>
                    <img
                      src={`https://api.cakecrazzy.com/${tag.image}`}
                      alt={tag.tagHeading}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>
                    {tag.multipulProduct.map((productId) => (
                      <span key={productId}>{productId.productName}, </span>
                    ))}
                  </td>
                  <td>
                    {tag.priceRange.map((range, index) => (
                      <div key={index}>
                        <strong>Min:</strong> {range.priceMinimum}{" "}
                        <strong>Max:</strong> {range.priceMaximum}{" "}
                        <img
                          src={`https://api.cakecrazzy.com/${range.priceRangeImage}`}
                          alt={`Price Range ${index}`}
                          style={{ width: "50px", height: "auto" }}
                        />
                      </div>
                    ))}
                  </td>
                  <td>
                    <Link
                      to={`/edit-product-tag/${tag._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    <button
                      className="bt delete"
                      onClick={() => deleteProductTag(tag._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Product Tags Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllProductTag;
