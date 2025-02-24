const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: String, required: true },
    cartItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            weight: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            deliveryDate: { type: String, required: true },
            // eggOption: { type: String, required: true },
            message: { type: String,}
        }
    ],
    totalPrice: { type: Number, required: true },
    transactionId: { type: String },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: { type: String, default: 'Order Is Placed' },
    paymentMode: { type: String, enum: ['online', 'cod'], default: "online" },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Checkout = mongoose.model("Checkout", checkoutSchema);
module.exports = Checkout;
