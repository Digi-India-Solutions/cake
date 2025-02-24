import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css"; // Create a separate CSS file for styling
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // States to store data for each section
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Function to fetch data sequentially
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get("https://api.cakecrazzy.com/api/user");
        setUsers(usersResponse.data.data);

        // Fetch banners
        const bannersResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-banners"
        );
        setBanners(bannersResponse.data.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-main-category"
        );
        setCategories(categoriesResponse.data.data);

        // Fetch sub-categories
        const subCategoriesResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-subcategory"
        );
        setSubCategories(subCategoriesResponse.data.data);

        // Fetch colors
        const colorsResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-color"
        );
        setColors(colorsResponse.data.data);

        // Fetch sizes
        const sizesResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-size"
        );
        setSizes(sizesResponse.data.data);

        // Fetch flowers
        const flowersResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-flover"
        );
        setFlowers(flowersResponse.data.data);

        // Fetch products
        const productsResponse = await axios.get(
          "https://api.cakecrazzy.com/api/all-product"
        );
        setProducts(productsResponse.data.data);

        // Fetch tags
        const tagsResponse = await axios.get(
          "https://api.cakecrazzy.com/api/get-tags"
        );
        setTags(tagsResponse.data.data);

        // Fetch vouchers
        // const vouchersResponse = await axios.get('https://api.cakecrazzy.com/api/vouchers');
        // setVouchers(vouchersResponse.data);

        // Fetch orders
        const ordersResponse = await axios.get(
          "https://api.cakecrazzy.com/api/checkouts"
        );
        // console.log(ordersResponse)
        setOrders(ordersResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  // States to store data for each section
  const [orderss, setOrderss] = useState([]);
  const [daySales, setDaySales] = useState([]);

  // useEffect(() => {
  //   // Function to fetch data sequentially
  //   const fetchData = async () => {
  //     try {
  //       // Fetch orders for show order graph
  //       const ordersResponse = await axios.get('https://api.cakecrazzy.com/api/orders');
  //       setOrderss(ordersResponse.data);

  //       // Fetch day-by-day sale data for the graph
  //       const salesResponse = await axios.get('https://api.cakecrazzy.com/api/day-sales');
  //       setDaySales(salesResponse.data);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []); // Empty dependency array to run only once on mount

  // // Prepare data for Show Orders Graph
  // const showOrdersData = {
  //   labels: orders.map(order => order.date), // Assuming 'date' is available in the orders
  //   datasets: [
  //     {
  //       label: 'Orders',
  //       data: orders.map(order => order.totalOrders), // Assuming 'totalOrders' contains order count
  //       fill: false,
  //       borderColor: 'rgba(75,192,192,1)',
  //       tension: 0.1
  //     }
  //   ]
  // };

  // Prepare data for Day by Day Sale Graph
  const daySalesData = {
    labels: daySales.map((sale) => sale.date), // Assuming 'date' is available in day sales
    datasets: [
      {
        label: "Sales",
        data: daySales.map((sale) => sale.totalSales), // Assuming 'totalSales' contains sale amounts
        fill: false,
        borderColor: "rgba(255,99,132,1)",
        tension: 0.1,
      },
    ],
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Cake Admin Panel</h1>
        <p>Manage your cake store data from here!</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <Link to="/dashboard">
            <i className="fa-solid fa-gauge"></i>
            <h3>Dashboard</h3>
            <p>Overview of all your activities</p>
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-orders">
            <i className="fa-solid fa-truck"></i>
            <h3>Manage Orders</h3>
            <p>Track and manage your customer orders</p>
            <p>{orders?.length} Orders</p>
            {/* Display orders data */}
            {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-banners">
            <i className="fa-regular fa-images"></i>
            <h3>Manage Banners</h3>
            <p>Update your website's banners</p>
            <p>{banners.length} Banners</p>
            {/* Display banners data */}
            {/* <pre>{JSON.stringify(banners, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-category">
            <i className="fa-solid fa-tags"></i>
            <h3>Manage Category</h3>
            <p>Manage categories of your products</p>
            <p>{categories.length} Categories</p>
            {/* Display categories data */}
            {/* <pre>{JSON.stringify(categories, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-subcategory">
            <i className="fa-solid fa-tag"></i>
            <h3>Manage Sub Category</h3>
            <p>Organize products in sub-categories</p>
            <p>{subCategories.length} Sub Categories</p>
            {/* Display sub-categories data */}
            {/* <pre>{JSON.stringify(subCategories, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-size">
            <i className="fa-solid fa-ruler-combined"></i>
            <h3>Manage Size</h3>
            <p>Update sizes for your products</p>
            <p>{sizes.length} Sizes</p>
            {/* Display sizes data */}
            {/* <pre>{JSON.stringify(sizes, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-products">
            <i className="fa-solid fa-boxes-stacked"></i>
            <h3>Manage Products</h3>
            <p>Add, update, or remove products</p>
            <p>{products.length} Products</p>
            {/* Display products data */}
            {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
          </Link>
        </div>

        <div className="dashboard-card">
          <Link to="/all-users">
            <i className="fa-solid fa-users"></i>
            <h3>All Users</h3>
            <p>View and manage users</p>
            <p>{users.length} Users</p>
            {/* Display users data */}
            {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
          </Link>
        </div>
      </div>

      {/* <div className="dashboard-card">
          <h3>Show Orders</h3>
          <p>Overview of your orders</p>
          <Line data={showOrdersData} />
        </div>

        <div className="dashboard-card">
          <h3>Day by Day Sales</h3>
          <p>Overview of your sales</p>
          <Line data={daySalesData} />
        </div> */}
    </div>
  );
};

export default Dashboard;
