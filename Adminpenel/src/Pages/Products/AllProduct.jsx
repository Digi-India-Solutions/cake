import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/all-product"
        );
        //console.log(response);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `https://api.cakecrazzy.com/api/delete-product/${productId}`
        );
        setProducts(products.filter((product) => product._id !== productId));
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product!");
      }
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Product List</h4>
        </div>
        <div className="links">
          <Link to="/add-product" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {/* <div className="filteration">
                <div className="search">
                    <label htmlFor="search">Search</label> &nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div> */}

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>S no</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Product Name</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{index + 1}</td>
                  <td>{product.categoryName?.mainCategoryName || "N/A"}</td>
                  <td>{product.subcategoryName?.subcategoryName || "N/A"}</td>
                  <td>{product.productName}</td>
                  <td>
                    {product.productImage.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={`https://api.cakecrazzy.com/${image}`}
                        alt="Product"
                        style={{ width: "50px", marginRight: "5px" }}
                      />
                    ))}
                  </td>
                  <td>
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="bt edit"
                    >
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => handleDelete(product._id)}
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

export default AllProduct;
