import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./homebanner.css";
import axios from "axios";

const HomeBannerSlider = () => {
  const [data, setData] = useState([]);

  // Function to fetch API data
  const getApiData = async () => {
    try {
      const res = await axios.get("https://api.cakecrazzy.com/api/get-banners");
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getApiData();
  }, []);

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    waitForAnimate: false,
    arrows: false,
  };

  return (
    <div className="container-fluid p-0">
      <div className="slider-container">
        <Slider {...settings} style={{ zIndex: -1 }}>
          {data.map((banner) => (
            <div key={banner._id}>
              <img
                className="banner-Image"
                alt={banner.bannerName}
                src={`https://api.cakecrazzy.com/${banner.bannerImage}`}
              />
              {/* <div className="overlay-content start-50 translate-middle text-center text-white">
                <div className="overlay">
                  <div className="bannerContent">
                    <h1>{banner.bannerName}</h1>
                    <p className="lead">{banner.bannerName}</p>
                    <a className="ordernowBtn" href="tel:+919508080807">
                      ORDER NOW
                    </a>
                    <h5>
                      Or Call <a href="tel:+919508080807">+91 9508080807</a>
                    </h5>
                  </div>
                </div>
              </div> */}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBannerSlider;
