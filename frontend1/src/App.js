import React from "react";
import "./App.css";
import "./allResponsive.css";
import "./responsive.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import AboutUs from "./Components/AboutUs/AboutUs";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AllCakes from "./Pages/AllCakes/AllCakes";
import AllCandles from "./Pages/AllCandles/AllCandles";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Cart from "./Pages/Cart/Cart";
import Login from "./Pages/Login/Login";
// import AllProducts from "./Components/AllProducts/AllProducts";
import TermsConditions from "./Pages/FooterPages/TermsConditions";
import PrivacyPolicy from "./Pages/FooterPages/PrivacyPolicy";
import FAQ from "./Pages/FooterPages/FAQ";
import AllProducts from "./Pages/AllProducts/AllProducts";
import CheckOut from "./Pages/checkout/Checkout";
import SuccessPage from "./Pages/successpage/SuccessPage";
import Profile from "./Pages/Profile/Profile";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/product-related/:subcatname" element={<AllCakes />} />
          <Route path="/candle/all-candles" element={<AllCandles />} />
          <Route path="/product-details/:name" element={<ProductDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/terms-&-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/frequently-asked-questions" element={<FAQ />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
