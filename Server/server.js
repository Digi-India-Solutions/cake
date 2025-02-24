const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const { connectDb } = require("./DB/ConntectDb")
const cors = require("cors")
const BannerRouter = require("./Router/BannerRouter")
const MainCategoryRouter = require("./Router/MainCategoryRouter")
const SubcCategoryRouter = require("./Router/SubcategoryRouter")
const ColorRouter = require("./Router/ColorRouter")
const SizeRouter = require("./Router/SizeRouter")
const FloverRouter = require("./Router/FloverRouter")
const RefrenceRouter = require("./Router/RefrenceRouter")
const TagRouter = require("./Router/tagRoutes")
const CategoryTitelRouter = require("./Router/categoryTitelRoutes")
const ProductRouter = require("./Router/productRoutes")
const InnerSubcategoryRouter = require("./Router/InnerSubcategoryRouter")
const ProductTagRouter = require("./Router/ProductTagRouter")
const checkoutRouter = require("./Router/CheckoutRouter")
const userRouter = require("./Router/UserRouter")
const ContactRouter = require("./Router/contactRoutes")


const app = express()


const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://www.cakecrazzy.com',
    'https://cakecrazzy.com',
    'https://admin.cakecrazzy.com',
];


  app.use(cors({
    origin: function(origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

  
app.use(express.json())
app.set(express.static("./Public"))
app.use("/Public", express.static("Public"))

app.get("/", (req, res) => {
    res.send("Server Is Running")
})

app.use("/api", BannerRouter)
app.use("/api", MainCategoryRouter)
app.use("/api", SubcCategoryRouter)
app.use("/api", ColorRouter)
app.use("/api", SizeRouter)
app.use("/api", FloverRouter)
app.use("/api", RefrenceRouter)
app.use("/api", TagRouter)
app.use("/api", CategoryTitelRouter)
app.use("/api", ProductRouter)
app.use("/api", InnerSubcategoryRouter)
app.use("/api", ProductTagRouter)
app.use("/api", checkoutRouter)
app.use("/api", userRouter)
app.use("/api", ContactRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server Start in ${process.env.PORT}`)
})


connectDb()