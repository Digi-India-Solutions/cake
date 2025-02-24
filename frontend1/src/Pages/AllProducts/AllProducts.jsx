import React from "react";
import { Link } from "react-router-dom";
import AllProduct from "../../Components/AllProducts/AllProducts";
const AllProducts = () => {
  return (
    <>
      {/* ----breadCrumb----  */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>All Products</h1>
          <Link to="/">Home /</Link> <Link to="">All Products</Link>
        </div>
      </section>
      {/* ----breadCrumb---- end  */}

      <AllProduct />
    </>
  );
};

export default AllProducts;
