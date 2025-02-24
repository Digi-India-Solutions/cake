import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./productDetails.css";
import AllProducts from "../../Components/AllProducts/AllProducts";
import axios from "axios";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { name } = useParams();
  const [data, setData] = useState({});
  const [activeWeight, setActiveWeight] = useState(null);
  const [price, setPrice] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [eggOption, setEggOption] = useState("");
  const [message, setMessage] = useState("");

  // Fetch product data by name
  const getApiData = async () => {
    try {
      const res = await axios.get(
        `https://api.cakecrazzy.com/api/get-product-by-name/${name}`
      );
      const productData = res.data.data;
      setData(productData);

      if (productData?.Variant?.length > 0) {
        setPrice(productData.Variant[0].finalPrice); // Default price for the first variant
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
  }, [name]);

  const handleWeightSelection = (weight) => {
    setActiveWeight(weight);
    const selectedVariant = data.Variant?.find(
      (variant) => variant?.weight?.sizeweight === weight
    );
    if (selectedVariant) {
      setPrice(selectedVariant.finalPrice);
    }
  };

  const addToCart = () => {
    // Check if variants exist and contain weights
    const hasWeightVariants = data.Variant?.some(
      (variant) => variant?.weight?.sizeweight
    );

    // If weights exist but none are selected
    if (hasWeightVariants && !activeWeight) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a weight before adding the product to the cart.",
      });
      return;
    }

    // Check if deliveryDate is provided
    if (!deliveryDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a delivery date before adding the product to the cart.",
      });
      return;
    }

    // Prepare the cart item
    const cartItem = {
      id: data._id,
      name: data.productName || "Unknown Product",
      weight: activeWeight || "N/A", // Default to "N/A" if no weight is required
      price: price || 0,
      deliveryDate,
      eggOption,
      description: data.productDescription || "",
      message: message || "",
      image: data.productImage?.[0] || "default-image.jpg", // Use default image if missing
      quantity: 1, // Initial quantity
    };

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check for existing item in the cart with the same product, weight, and egg option
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.weight === cartItem.weight &&
        item.eggOption === cartItem.eggOption
    );

    if (existingItemIndex !== -1) {
      // Item already in the cart with the same weight and egg option
      Swal.fire({
        icon: "error",
        title: "Product Already in Cart",
        text: "This product is already in your cart.",
      });
      return;
    }

    // Check for the same product with a different weight or egg option
    const differentWeightItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.weight !== cartItem.weight &&
        item.eggOption === cartItem.eggOption
    );

    if (differentWeightItemIndex !== -1) {
      // Different weight, allow adding to cart
      cart.push(cartItem);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product with the selected weight added to cart successfully!",
      });
    } else {
      // No such product with a different weight, add it
      cart.push(cartItem);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added to cart successfully!",
      });
    }
  };

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            src={`https://api.cakecrazzy.com/${data.productImage?.[i]}`}
            className="w-100"
            style={{ borderRadius: "1rem" }}
            alt={`Thumbnail ${i + 1}`}
          />
        </a>
      );
    },
    dots: true,
    arrow: false,
    dotsClass: "miniImage",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Product Details</h1>
          <Link to="/">Home /</Link>{" "}
          <Link to="">{data?.categoryName?.mainCategoryName} /</Link>{" "}
          <Link to="">{data.productName}</Link>
        </div>
      </section>

      {/* Product Image and Details Section */}
      <section className="productDetails">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="slider-container">
                {data.productImage?.length > 0 ? (
                  <Slider {...settings}>
                    {data.productImage.map((image, index) => (
                      <div key={index} className="productImage">
                        <img
                          className="productImageMain"
                          src={`https://api.cakecrazzy.com/${image}`}
                          style={{ borderRadius: "0.5rem" }}
                          alt={`Product Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
            <div className="col-md-7">
              <div className="detailSection">
                <h5 className="detailsHeading">{data.productName}</h5>
                <p className="detailPrice">
                  ₹ <span>{Math.round(price)}</span>
                </p>

                <div className="select_weight">
                  {data.Variant?.some(
                    (variant) => variant?.weight?.sizeweight
                  ) && (
                    <>
                      <p>Select Weight:</p>
                      {data.Variant.map(
                        (variant) =>
                          variant?.weight?.sizeweight && (
                            <button
                              key={variant._id}
                              className={`weight_button ${
                                activeWeight === variant.weight.sizeweight
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleWeightSelection(variant.weight.sizeweight)
                              }
                            >
                              {variant.weight.sizeweight}
                            </button>
                          )
                      )}
                    </>
                  )}
                </div>

                <div className="calander mt-2">
                  <div>
                    <label htmlFor="deliveryDate">Select Delivery Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="deliveryDate"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>

                  {/* {
                    data?.categoryName?.mainCategoryName === "cake" ? <div className="mt-3">
                      <label htmlFor="withEgg" className="custom-radio">
                        <input
                          type="radio"
                          name="eggOption"
                          id="withEgg"
                          className="me-1"
                          value="With Egg"
                          onChange={(e) => setEggOption(e.target.value)}
                        />
                        With Egg
                      </label>
                      <label htmlFor="eggless" className="custom-radio ms-3">
                        <input
                          type="radio"
                          name="eggOption"
                          id="eggless"
                          className="me-1"
                          value="Eggless"
                          onChange={(e) => setEggOption(e.target.value)}
                        />
                        Eggless
                      </label>
                    </div> : null
                  } */}
                </div>

                <div className="message">
                  <textarea
                    className="form-control"
                    placeholder="Enter Message Related To Product..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="productDetail_buttons mt-3">
                  <button className="add_to_cart" onClick={addToCart}>
                    <i className="bi bi-cart3"></i> Add To Cart
                  </button>
                  {/* <button className="by_now">
                    <i className="bi bi-lightning-fill"></i> Buy Now
                  </button> */}
                </div>

                <div className="productDescription">
                  <div className="descrip">
                    <b>Description:</b>
                    <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.productDescription,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="relatedProducts">
        <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
        <div className="container">
          <h2 className="mb-0">Related Products</h2>
        </div>
        <AllProducts />
      </section>
    </>
  );
};

export default ProductDetails;
