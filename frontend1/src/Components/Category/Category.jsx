import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./category.css";
import axios from "axios";
import cakeImage from "../../images/cake1.jpg"; // Default image if no image is provided

const Category = () => {
  const [categories, setCategories] = useState([]); // State to store fetched categories
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch active subcategories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.cakecrazzy.com/api/get-subcategory-by-status"
        );
        console.log(response.data.data);
        if (response.data.success) {
          setCategories(response.data.data); // Set fetched data to state
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchCategories();
  }, []);

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 6 } },
      { breakpoint: 992, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  // Display loading message while fetching data
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <section className="category-main">
        <div className="category-container">
          <Slider {...settings}>
            {categories.map((item) => (
              <div key={item._id} className="category-slide">
                <Link
                  to={`/product-related/${item.subcategoryName}`}
                  className="category-link"
                >
                  {/* Use a default image if no image is provided */}
                  <img
                    src={`https://api.cakecrazzy.com/${item.image}`}
                    alt={item.subcategoryName}
                    className="category-image"
                  />
                  <p className="category-name">{item.subcategoryName}</p>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Category;
