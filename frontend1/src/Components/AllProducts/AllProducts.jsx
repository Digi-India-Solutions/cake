import React, { useEffect, useState } from "react";
import "./allproducts.css";
import axios from "axios";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState({});
  const [currentPage, setCurrentPage] = useState({}); // Stores current page for each category
  const productsPerPage = 20; // Set limit

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getApiData();
    getApiProductData();
  }, []);



  const getApiData = async () => {
    try {
      const res = await axios.get(
        "https://api.cakecrazzy.com/api/get-main-category"
      );
      if (res.status === 200) {
        setCategoryData(res.data.data);
        const initialPageState = res.data.data.reduce((acc, item) => {
          acc[item._id] = 1; // Set default page to 1 for each category
          return acc;
        }, {});
        setCurrentPage(initialPageState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getApiProductData = async () => {
    try {
      const res = await axios.get("https://api.cakecrazzy.com/api/all-product");
      if (res.status === 200) {
        const groupedProducts = res.data.data.reduce((acc, product) => {
          const categoryId = product.categoryName._id;
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push(product);
          return acc;
        }, {});
        setProductData(groupedProducts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Next & Previous Pagination
  const handleNextPage = (categoryId) => {
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] + 1,
    }));
  };

  const handlePrevPage = (categoryId) => {
    setCurrentPage((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] > 1 ? prev[categoryId] - 1 : 1,
    }));
  };

  return (
    <div className="allproducts container-fluid">
      {categoryData.map((category) => {
        const categoryId = category._id;
        const allProducts = productData[categoryId] || [];
        const totalProducts = allProducts.length;
        const startIndex = (currentPage[categoryId] - 1) * productsPerPage;
        const visibleProducts = allProducts.slice(
          startIndex,
          startIndex + productsPerPage
        );
        const hasNextPage = startIndex + productsPerPage < totalProducts;
        const hasPrevPage = currentPage[categoryId] > 1;

        return (
          <div key={categoryId} className="featured-menu">
            <h2 className="featured-menu-title text-uppercase">
              {category.mainCategoryName}
            </h2>
            <div className="product-main-category">
              {visibleProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img
                      src={`https://api.cakecrazzy.com/${product.productImage[0]}`}
                      alt={product.productName}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="product-title">{product.productName}</h3>
                  <p className="d-flex gap-2 align-items-center">
                    <span className="product-main-price"> ₹ 300</span>
                    <span className="discount-price">
                      ₹ <del>375</del> 20% OFF
                    </span>
                  </p>
                  <Link
                    to={`/product-details/${product.productName}`}
                    className="order-button"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              {hasPrevPage && (
                <button
                  className="prev-btn"
                  onClick={() => handlePrevPage(categoryId)}
                >
                  Previous
                </button>
              )}
              {hasNextPage && (
                <button
                  className="next-btn"
                  onClick={() => handleNextPage(categoryId)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllProducts;
