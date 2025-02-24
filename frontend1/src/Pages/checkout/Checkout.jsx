import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Swal from "sweetalert2";
import "./checkout.css";

const CheckOut = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const userid = sessionStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    userId: userid,
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    pin: "",
    totalPrice: 0,
    paymentMode: "online",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    setFormData((prevData) => ({
      ...prevData,
      cartItems: storedCart,
      totalPrice: calculateTotal(storedCart),
    }));
  }, []);

  const calculateTotal = (items) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shipping = subtotal < 500 ? 50 : 0;
    return subtotal + shipping;
  };

  const handlePlaceOrder = async () => {
    if (formData.paymentMode === "online") initiateOnlinePayment();
    else submitOrder();
  };

  const initiateOnlinePayment = async () => {
    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/checkout",
        formData
      );
      //console.log(response);
      const { razorpayOrderId, amount, currency } = response.data;
      console.log(amount);
      console.log(razorpayOrderId);
      console.log(currency);
      const options = {
        key: "rzp_test_XPcfzOlm39oYi8",
        amount,
        currency,
        name: "Crazy Cake",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          try {
            const verifyResponse = await axios.post(
              "https://api.cakecrazzy.com/api/verify-payment",
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }
            );
            if (
              verifyResponse.data.message ===
              "Payment successful and order confirmed."
            ) {
              Swal.fire("Success", "Payment Successful!", "success");
              sessionStorage.removeItem("cart");
              setCartItems([]);
              navigate("/success", {
                state: {
                  paymentStatus: "online",
                  orderId: response.data.orderId,
                },
              });
            } else {
              Swal.fire("Error", "Payment verification failed!", "error");
            }
          } catch (error) {
            console.error("Verification error:", error);
            Swal.fire("Error", "Error verifying payment!", "error");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      Swal.fire(
        "Error",
        "Error initiating payment. Please try again.",
        "error"
      );
    }
  };

  const submitOrder = async () => {
    try {
      const response = await axios.post(
        "https://api.cakecrazzy.com/api/checkout",
        formData
      );
      if (response.status === 200) {
        Swal.fire("Success", "Order placed successfully!", "success");
        sessionStorage.removeItem("cart");
        setCartItems([]);
        navigate("/success", {
          state: { paymentStatus: "cod", orderId: response.data.orderId },
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire(
        "Error",
        "Failed to place the order. Please try again.",
        "error"
      );
    }
  };

  return (
    <section className="checkoutPage">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Checkout</h2>
          <form>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input
                type="tel"
                placeholder="+91 123 456 7890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <input
                  type="text"
                  placeholder="Pin Code"
                  value={formData.pin}
                  onChange={(e) =>
                    setFormData({ ...formData, pin: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
              ></textarea>
            </div>
            <div className="terms">
              <label>
                <input type="checkbox" required /> I have read and agree to the
                Terms and Conditions.
              </label>
            </div>
          </form>
        </div>
        {cartItems.length > 0 ? (
          <div className="cart-review">
            <h2>Review your cart</h2>
            {cartItems.length > 0 ? (
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={`${item.id}-${item.weight}`}>
                      <td>
                        <img
                          src={`https://api.cakecrazzy.com/${item.image}`}
                          alt={item.name}
                          style={{ height: 50 }}
                        />
                      </td>
                      <td className="carttext">{item.name}</td>
                      <td>{item.weight}</td>
                      <td>₹{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <div className="totals">
              {/* <p>Subtotal: ₹{formData.totalPrice.toFixed(2)}</p> */}
              <p>Shipping: ₹{formData.totalPrice < 500 ? 50 : 0}</p>
              <h3>Total: ₹{formData.totalPrice.toFixed(2)}</h3>
            </div>
            <h5>Choose Payment Method</h5>
            <div className="form-group">
              <select
                value={formData.paymentMode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.target.value })
                }
              >
                <option value="online">Online Payment</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <button
              className="checkout-btn"
              type="button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CheckOut;
