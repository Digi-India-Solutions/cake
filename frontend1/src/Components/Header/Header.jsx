import React, { useEffect, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const loginvalue = sessionStorage.getItem("login");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-category-with-subcategory"
        );
        if (
          response.data.message ===
          "Categories with subcategories retrieved successfully"
        ) {
          setCategories(response.data.data); // Store the categories data
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div>
        <header className="custom-navbar navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <div className="navbar-container">
              <div className="logo-container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                  <h1
                    style={{
                      fontFamily: "var(--font-family-design)",
                      color: "var(--color-pink)",
                    }}
                  >
                    Cake Crazzy
                  </h1>
                </Link>
              </div>

              <div className="search-container">
                <form action="">
                  <div className="d-flex">
                    <input
                      className="form-control searchInput"
                      type="search"
                      placeholder="Search"
                    />
                    <button className="searchBtn">Search</button>
                  </div>
                </form>
              </div>

              {/* Cart & Login */}
              <div className="cart-login-container">
                <Link to="/cart">
                  <i className="bi bi-bag"></i>
                </Link>
                <span className="mx-2">|</span>
                {loginvalue ? (
                  <Link to="/profile" className="me-2">
                    <i className="bi bi-person-fill"></i>
                  </Link>
                ) : (
                  <Link to="/login" className="me-2">
                    <i className="bi bi-person-fill"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="navbar position-sticky navbar-expand-lg navbar-light">
          <div className="container">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about-us">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/all-products">
                    All Products
                  </Link>
                </li>

                {categories.map((category) => (
                  <li key={category._id} className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to={`#${category.mainCategoryName}`}
                      id={`${category.mainCategoryName}Dropdown`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {category.mainCategoryName}
                    </Link>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby={`${category.mainCategoryName}Dropdown`}
                    >
                      {/* <li><Link className="dropdown-item" to={`/${category.mainCategoryName}/all-${category.mainCategoryName}`}>All {category.mainCategoryName}</Link></li> */}
                      {category.subcategories.map((subcategory, index) => (
                        <li key={index}>
                          <Link
                            className="dropdown-item"
                            to={`/product-related/${subcategory.subcategoryName}`}
                          >
                            {subcategory.subcategoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}

                <li className="nav-item">
                  <Link className="nav-link" to="/contact-us">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
