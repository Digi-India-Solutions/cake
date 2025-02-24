const { createSize, getAllSizes, getSingleSize, deleteSize, updateSize } = require("../Controller/SizeController")

const SizeRouter = require("express").Router()

SizeRouter.post("/create-size" ,createSize)
SizeRouter.get("/get-size" ,getAllSizes)
SizeRouter.get("/get-single-size/:id" ,getSingleSize)
SizeRouter.delete("/delete-size/:id" ,deleteSize)
SizeRouter.put("/update-size/:id" ,updateSize)

module.exports = SizeRouter