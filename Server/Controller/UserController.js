const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/SignupModel');
const transporter = require("../Utils/Mailsender");


// Create a new user record
const createRecord = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Send email after successful account creation
        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: newUser.email,
            subject: "Welcome to Cake Crazzy - Your Account Has Been Created!",
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; background-color: #ff5733; color: #ffffff; padding: 20px;">
                                <h1 style="margin: 0;">Welcome to Cake Crazzy!</h1>
                            </div>
                            <div style="margin-top: 20px; padding: 20px; text-align: center;">
                                <p style="font-size: 16px; line-height: 1.6;">Hello ${newUser.name},</p>
                                <p style="font-size: 16px; line-height: 1.6;">We're excited to let you know that your account has been successfully created with Cake Crazzy!</p>
                                <p style="font-size: 16px; line-height: 1.6;">You can now explore a wide range of delicious cakes and treats available for you. Enjoy our amazing deals!</p>
                                <a href="https://cakecrazzy.com" style="display: inline-block; padding: 12px 30px; background-color: #ff5733; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Shop Now</a>
                            </div>
                            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #777777;">
                                <p style="margin: 0;">Thank you for choosing Cake Crazzy. We are excited to serve you the best cakes in town!</p>
                                <p style="margin: 0;">Team Cake Crazzy</p>
                                <p style="margin: 0;">If you have any questions, feel free to contact us at <a href="mailto:support@cakecrazzy.com" style="color: #ff5733;">support@cakecrazzy.com</a></p>
                            </div>
                        </div>
                    </body>
                </html>
            `,
        };


        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error);
                return res.status(401).json({ success: false, message: "Failed to send email." });
            }
        });

        res.status(200).json({
            success: true,
            message: "New user account created successfully.",
            data: newUser
        });
    } catch (error) {
        console.log(error)
        if (error.keyValue?.phone) {
            return res.status(400).json({ success: false, message: "Phone number already registered." });
        } else if (error.keyValue?.email) {
            return res.status(400).json({ success: false, message: "Email already registered." });
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error." });
        }
    }
};

// Get all user records
const getRecord = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "User records found.",
            data: users.reverse()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error."
        });
    }
};

// Get a single user record by ID
const getSingleRecord = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User record not found." });
        }
        res.status(200).json({
            success: true,
            message: "User record found.",
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

const DeleteRecord = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user)
        if (!user) {
            return res.status(400).json({ success: false, message: "User record not found." });
        }
        await user.deleteOne()
        res.status(200).json({
            success: true,
            message: "User delete successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        const key = user.role === "Admin" ? process.env.JWT_SALT_KEY_ADMIN : process.env.JWT_SALT_KEY_BUYER;
        const token = jwt.sign({ userId: user._id }, key, { expiresIn: '15d' });

        res.status(200).json({
            success: true,
            data: user,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Forgot password: Step 1 (Send OTP)
const forgetPassword1 = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        const otp = Math.floor(Math.random() * 1000000);
        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: user.email,
            subject: "OTP for Password Reset",
            text: `Hello ${user.name},\n\nYour OTP for password reset is ${otp}. Please do not share this OTP with anyone.\n\nTeam Ricco`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(400).json({ success: false, message: "Failed to send OTP." });
            }
        });

        res.status(200).json({ success: true, message: "OTP sent to your registered email address." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Forgot password: Step 2 (Validate OTP)
const forgetPassword2 = async (req, res) => {
    try {
        const { username, email, otp } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized activity." });
        }

        if (user.otp !== parseInt(otp)) {
            return res.status(401).json({ success: false, message: "Invalid OTP." });
        }

        res.status(200).json({ success: true, message: "OTP validated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

// Forgot password: Step 3 (Reset password)
const forgetPassword3 = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized activity." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password has been reset." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

module.exports = {
    createRecord,
    getSingleRecord,
    login,
    forgetPassword1,
    forgetPassword2,
    forgetPassword3,
    getRecord,
    DeleteRecord
};
