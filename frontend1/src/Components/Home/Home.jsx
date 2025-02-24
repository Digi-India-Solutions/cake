import React from "react";
import HomeBannerSlider from "../BannerSlider/HomeBannerSlider";
import Hero from "../Hero/Hero";
import AllProducts from "../AllProducts/AllProducts";
import Testimonial from "../Testimonial/Testimonial";
import Category from "../Category/Category";

const Home = () => {
  return (
    <>
      <HomeBannerSlider />
      <Category />
      <Hero />
      <AllProducts />
      <Testimonial />
    </>
  );
};

export default Home;
