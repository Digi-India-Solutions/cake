import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://api.cakecrazzy.com/api/checkouts");
      //console.log(response);
      setOrders(response.data);
      setFilteredOrders(response.data); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        await axios.delete(`https://api.cakecrazzy.com/api/checkout/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
        toast.success("Order deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  // Filter orders based on search query
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = orders.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query)
    );
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Orders</h4>
        </div>
        <div className="links">
          {/* Additional links or actions can be placed here */}
        </div>
      </div>

      <div className="filteration">
        <div className="selects">
          <select>
            <option value="">All Orders</option>
            <option value="today">Today's Orders</option>
            <option value="yesterday">Yesterday's Orders</option>
            <option value="thisWeek">This Week's Orders</option>
            <option value="thisMonth">This Month's Orders</option>
            <option value="thisYear">This Year's Orders</option>
          </select>
        </div>
        <div className="search">
          <label htmlFor="search">Search </label>&nbsp;
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Order ID</th>
              <th scope="col">Items</th>
              <th scope="col">Final Price</th>
              <th scope="col">Order Status</th>
              <th scope="col">Payment Mode</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Order Date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Link to={`/order-details/${order._id}`}>{order._id}</Link>
                  </td>
                  <td>{order.cartItems.length}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.paymentMode}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="bt delete"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AllOrder;
