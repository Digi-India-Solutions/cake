import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const loginvalue = sessionStorage.getItem("login");
  const navigate = useNavigate();
  // Fetch cart data from sessionStorage
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Create a unique ID by combining the product id and weight
  const getUniqueId = (id, weight) => `${id}-${weight}`;

  const handleIncrement = (id, weight) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        getUniqueId(item.id, item.weight) === getUniqueId(id, weight)
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      sessionStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleDecrement = (id, weight) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        getUniqueId(item.id, item.weight) === getUniqueId(id, weight) &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      sessionStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const handleRemove = (id, weight) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => getUniqueId(item.id, item.weight) !== getUniqueId(id, weight)
      );
      sessionStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleConfirmBooking = () => {
    if (!loginvalue) {
      navigate("/login"); // Redirect to login if not logged in
    } else {
      navigate("/checkout"); // Redirect to checkout if logged in
    }
  };

  return (
    <>
      {/* ----breadCrumb----  */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Cart</h1>
          <Link to="/">Home /</Link> <Link to="">Cart</Link>
        </div>
      </section>
      {/* ----breadCrumb---- end  */}

      <section className="cartSection container">
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={getUniqueId(item.id, item.weight)}
                  className="cart-item"
                >
                  <img
                    src={`https://api.cakecrazzy.com/${item.image}`}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>
                      ₹{item.price}{" "}
                      <span className="item-weight">{item.weight}</span>
                    </p>
                    {item.deliveryDate && (
                      <p className="selected-date">
                        Selected Date: <span>{item.deliveryDate}</span>
                      </p>
                    )}
                    {item.eggOption && (
                      <p>
                        Egg Option: <span>{item.eggOption}</span>
                      </p>
                    )}
                    {item.message && (
                      <p className="item-message">
                        Message: <span>{item.message}</span>
                      </p>
                    )}
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleDecrement(item.id, item.weight)}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() => handleIncrement(item.id, item.weight)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.id, item.weight)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              ))
            ) : (
              <>
                <p>Your cart is empty. Add some products to your cart!</p>
                <Link to="/" className="checkout-btn">
                  GO TO Home Page
                </Link>
              </>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="order-summary">
              <h2>Order Summary</h2>
              <p>Items: {cartItems.length}</p>
              <p>Total: ₹{total.toFixed(2)}</p>
              <button className="confirm-button" onClick={handleConfirmBooking}>
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
