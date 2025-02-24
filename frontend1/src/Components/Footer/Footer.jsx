import React, { useEffect, useState } from "react";
import "./Footer.css"; // Import the CSS file for styling
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
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
    <footer className="footer">
      <div className="Footeroverlay">
        <div className="footer-content container-fluid">
          <div className="footer-section">
            <h3>POLICY INFO</h3>
            <Link to="/terms-&-conditions">
              <i className="bi bi-arrow-right-short"></i> Terms & Conditions
            </Link>
            <Link to="/privacy-policy">
              <i className="bi bi-arrow-right-short"></i> Privacy Policy
            </Link>
          </div>
          <div className="footer-section">
            <h3>ABOUT US</h3>
            <Link to="/about-us">
              <i className="bi bi-arrow-right-short"></i> Our Story
            </Link>
            <Link to="/frequently-asked-questions">
              <i className="bi bi-arrow-right-short"></i> FAQs
            </Link>
          </div>
          {/* <div className="footer-section">
            <h3>OUR BAKERY</h3>
            <ul className='p-0'>
              {categories.map((category) => (
                <li className='footer-product-api' key={category._id}>
                  <Link className='d-none' to={`#${category.mainCategoryName}`}>{category.mainCategoryName}</Link>
                  <ul className='p-0'>
                    {category.subcategories.map((subcategory, index) => (
                      <li className='footer-product-api' key={index}>
                        <Link to={`/product-related/${subcategory.subcategoryName}`}>{subcategory.subcategoryName}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div> */}
          <div className="footer-section">
            <h3>NEED HELP?</h3>
            <Link to="/contact-us">
              <i className="bi bi-arrow-right-short"></i> Contact Us
            </Link>
            <Link to="/frequently-asked-questions">
              <i className="bi bi-arrow-right-short"></i> FAQs
            </Link>
          </div>
          <div className="footer-section">
            <h3>FOLLOW US</h3>
            <Link
              to="https://www.instagram.com/p/DCTnSTiPzrp/?igsh=MTA1YXpubGVlOXhjZg=="
              target="_blank"
            >
              <i className="bi bi-arrow-right-short"></i> Instagram
            </Link>
            <Link to="https://wa.me/919508080807" target="_blank">
              <i className="bi bi-arrow-right-short"></i> Whatsapp
            </Link>
          </div>
        </div>
        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p className="mb-0">
            © 2024 Cake Bakery | Crafted with by{" "}
            <a href="https://www.digiindiasolutions.com" className="heart">
              Digi India Solution
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
