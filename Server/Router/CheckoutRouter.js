const { createCheckout, getAllCheckouts, getCheckoutById, updateCheckoutStatus, deleteCheckout, getCheckOutByUserID, verifyPayment } = require("../Controller/CheckoutController");

const checkoutRouter = require("express").Router()



checkoutRouter.post("/checkout", createCheckout)
checkoutRouter.get('/checkouts', getAllCheckouts);
checkoutRouter.get('/checkout/:id', getCheckoutById);
checkoutRouter.put('/checkout/:id', updateCheckoutStatus);
checkoutRouter.delete('/checkout/:id', deleteCheckout);
checkoutRouter.get('/checkout/user/:userId', getCheckOutByUserID);
checkoutRouter.post("/verify-payment", verifyPayment)


module.exports = checkoutRouter