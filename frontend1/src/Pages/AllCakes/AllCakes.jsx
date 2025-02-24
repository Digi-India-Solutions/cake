import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./allcakes.css";
import axios from "axios";

const AllCakes = () => {
  const { subcatname } = useParams();
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null); // New state for selected price range
  const [cakesArr, setCakesArr] = useState([]);

  // Function to fetch products based on selected price range
  const getProductrelatedSubcategory = async () => {
    try {
      let url = `https://api.cakecrazzy.com/api/get-product-by-subcatname/${subcatname}`;

      // Add price filter if selected
      if (selectedPrice) {
        url += `?priceRange=${selectedPrice}`;
      }

      const res = await axios.get(url);
      console.log(res);
      if (res.status === 200) {
        setCakesArr(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductrelatedSubcategory();
  }, [subcatname, selectedPrice]); // Re-fetch products when subcategory or selected price changes

  const handlePriceFilter = (priceRange) => {
    setSelectedPrice(priceRange);
    setPriceOpen(false); // Close the price filter dropdown after selection
  };

  return (
    <>
      {/* ----breadCrumb----  */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Cakes for Every Taste</h1>
          <Link to="/">Home /</Link> <Link to="">Cakes</Link>
        </div>
      </section>
      {/* ----breadCrumb---- end  */}

      <section className="allProducts">
        <div className="mainProducts">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="filter-header">Filters</div>

            {/* Price Filter */}
            <div className="filter-section">
              <div
                className="filter-title"
                onClick={() => setPriceOpen(!priceOpen)}
              >
                Price <span>{priceOpen ? "−" : "+"}</span>
              </div>
              <ul className={`filter-options ${priceOpen ? "open" : ""}`}>
                <li onClick={() => handlePriceFilter("200-500")}>
                  ₹200 - ₹500
                </li>
                <li onClick={() => handlePriceFilter("500-1000")}>
                  ₹500 - ₹1000
                </li>
                <li onClick={() => handlePriceFilter("1000-2000")}>
                  ₹1000 - ₹2000
                </li>
                <li onClick={() => handlePriceFilter("2000+")}>Above ₹2000</li>
              </ul>
            </div>

            {/* Other Filters (Optional) */}
            {/* You can leave the other filters here if needed */}
          </div>

          {/* Main Content Area */}
          <div className="allContentSide">
            <h1>{subcatname}</h1>
            <div>
              <div className="row">
                {cakesArr.map((item, index) => (
                  <div className="col-md-3 col-6 mb-3" key={index}>
                    <div className="card">
                      <Link to={`/product-details/${item.productName}`}>
                        <img
                          src={`https://api.cakecrazzy.com/${item.productImage[0]}`}
                          className="w-100"
                          alt="images"
                        />
                        <div className="productDetails">
                          <p className="productTitle">{item.productName}</p>
                          <p className="d-flex gap-2 align-items-center m-0">
                            <span className="productPrice">
                              ₹{Math.round(item.Variant[0].finalPrice)}
                            </span>
                            <span className="discount-price">
                              ₹ <del>375</del> 20% OFF
                            </span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllCakes;
