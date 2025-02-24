import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditOrder = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  // Fetch API data
  const getApiData = async () => {
    try {
      const res = await axios.get(`https://api.cakecrazzy.com/api/checkout/${id}`);
      setOrderData(res.data);
      setOrderStatus(res.data.orderStatus);
      setPaymentStatus(res.data.paymentStatus);
    } catch (error) {
      console.error("Error fetching order data:", error);
      toast.error("Failed to fetch order data.");
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  // Update Order Status and Payment Status
  const handleUpdate = async () => {
    try {
      const updatedData = {
        orderStatus,
        paymentStatus,
      };
      const res = await axios.put(
        `https://api.cakecrazzy.com/api/checkout/${id}`,
        updatedData
      );
      toast.success("Order updated successfully!");
      setOrderData(res.data); // Optionally refresh the data
      navigate("/all-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  // Determine if the "Order Status" dropdown should be disabled
  const isOrderStatusDisabled =
    orderStatus === "Delivered" || orderStatus === "Cancelled";
  const isPaymentStatusDisabled = paymentStatus === "Success";

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>Update Order</h4>
        </div>
        <div className="links">
          <Link to="/all-orders" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Order Details</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th scope="row">Order ID</th>
                      <td>{orderData._id}</td>
                    </tr>
                    <tr>
                      <th scope="row">User Name</th>
                      <td>{orderData.name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{orderData.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone Number</th>
                      <td>{orderData.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row">Address</th>
                      <td>
                        {orderData.address}, {orderData.city}, {orderData.state}
                        , {orderData.pin}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Order Date</th>
                      <td>{new Date(orderData.orderDate).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <th scope="row">Final Price</th>
                      <td>₹{orderData.totalPrice}</td>
                    </tr>
                    <tr>
                      <th scope="row">Order Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          disabled={isOrderStatusDisabled} // Disable the dropdown based on payment and status
                        >
                          <option value="Order Confirmed	">
                            Order Confirmed{" "}
                          </option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Payment Mode</th>
                      <td>{orderData.paymentMode}</td>
                    </tr>
                    <tr>
                      <th scope="row">Payment Status</th>
                      <td>
                        <select
                          className="form-select"
                          value={paymentStatus}
                          onChange={(e) => setPaymentStatus(e.target.value)}
                          disabled={isPaymentStatusDisabled} // Disable if payment is success
                        >
                          <option value="Pending">Pending</option>
                          <option value="Success">Success</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Items</h5>
              </div>
              <div className="card-body">
                {orderData.cartItems && orderData.cartItems.length > 0 ? (
                  orderData.cartItems.map((item, index) => (
                    <div key={index} className="mb-3">
                      <strong>{item.name}</strong>
                      <br />
                      <p className="mb-1">Quantity: {item.quantity}</p>
                      <p className="mb-1">Weight: {item.weight}</p>
                      <p className="mb-1">Price: ₹{item.price}</p>
                      <p className="mb-1">
                        Delivery Date:{" "}
                        {new Date(item.deliveryDate).toLocaleString()}
                      </p>
                      <p className="mb-0">Message: {item.message}</p>
                      <img
                        src={`https://api.cakecrazzy.com/${item.image}`}
                        alt={item.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          marginTop: "10px",
                        }}
                      />
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No items in the cart.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update Order
            </button>
            <Link to="/all-orders" className="btn btn-secondary ms-2">
              Back
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default EditOrder;
