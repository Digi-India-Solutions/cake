import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const userid = sessionStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);

  const getApiData = async () => {
    try {
      const res = await axios.get("https://api.cakecrazzy.com/api/user/" + userid);
      if (res.status === 200) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderData = async () => {
    try {
      const res = await axios.get(
        "https://api.cakecrazzy.com/api/checkout/user/" + userid
      );
      if (res.status === 200) {
        setOrders(res.data.data); // Store orders in state
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApiData();
    getOrderData();
  }, [userid]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Profile</h1>
          <Link to="/">Home /</Link> <Link to="">Profile</Link>
        </div>
      </section>

      <div className="container profile">
        <h1>Our Profile</h1>
        <div className="d-flex justify-content-center">
          <div className="prifileContent">
            <p>
              <b>Name</b>: {user.name}
            </p>
            <p>
              <b>Email</b>: {user.email}
            </p>
          </div>
        </div>

        <div className="logout-btn-container">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="orderHistory">
          <h2>Order History</h2>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="order-container" key={order._id}>
                <div className="order-details">
                  <p>
                    <b>Order ID:</b> {order._id}
                  </p>
                  <p>
                    <b>Total Price:</b> ₹{order.totalPrice}
                  </p>
                  <p>
                    <b>Transaction ID:</b> {order.transactionId || "N/A"}
                  </p>
                  <p>
                    <b>Payment Status:</b> {order.paymentStatus}
                  </p>
                  <p>
                    <b>Order Status:</b> {order.orderStatus}
                  </p>
                  <p>
                    <b>Payment Mode:</b> {order.paymentMode}
                  </p>
                </div>
                <div className="cart-items">
                  <h3>Cart Items</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Weight</th>
                        <th>Egg Option</th>
                        <th>Price</th>
                        <th>Delivery Date</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.cartItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <img
                              src={`https://api.cakecrazzy.com/${item.image}`}
                              alt=""
                              style={{ height: 50 }}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.weight}</td>
                          <td>{item.eggOption}</td>
                          <td>₹{item.price}</td>
                          <td>
                            {new Date(item.deliveryDate).toLocaleDateString()}
                          </td>
                          <td>{item.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
