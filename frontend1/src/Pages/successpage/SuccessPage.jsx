import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  // Import useLocation for accessing the passed state
import './SuccessPage.css';

const SuccessPage = () => {
    const location = useLocation();  // Get the passed state
    const navigate = useNavigate();  // Initialize useNavigate

    const { paymentStatus, orderId } = location.state || {};  // Destructure state values

    const handleGoHome = () => {
        navigate('/');  // Navigate to home page
    };

    return (
        <div className="success-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card success-card">
                            <div className="card-body text-center">
                                <h2 className="success-title">Thank You for Your Order!</h2>
                                {paymentStatus === 'online' ? (
                                    <>
                                        <p className="success-message">
                                            Your payment was successful. The team at <strong>Cake Crazy</strong> is
                                            preparing your cake, flowers, and candles, and it will be with you soon!
                                        </p>
                                        <img
                                            src="https://via.placeholder.com/150x150.png?text=Cake+Crazy"
                                            alt="Cake Crazy Logo"
                                            className="img-fluid mb-4"
                                        />
                                        <p className="order-id">
                                            <strong>Order ID:</strong> {orderId}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="success-message">
                                            Thank you for placing your order! Your order will be shipped shortly and
                                            you'll receive an email confirmation once it's on its way.
                                        </p>
                                        <p className="order-id">
                                            <strong>Order ID:</strong> {orderId}
                                        </p>
                                    </>
                                )}
                                <button
                                    onClick={handleGoHome}
                                    className="btn btn-primary go-home-btn"
                                >
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
