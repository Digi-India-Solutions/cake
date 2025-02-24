const { createColor, getAllColors, getColorById, updateColor, deleteColor } = require("../Controller/ColorController")

const ColorRouter = require("express").Router()

ColorRouter.post("/create-color" ,createColor)
ColorRouter.get("/get-color" ,getAllColors)
ColorRouter.get("/get-single-color/:id" ,getColorById)
ColorRouter.put("/update-color/:id" ,updateColor)
ColorRouter.delete("/delete-color/:id" ,deleteColor)

module.exports = ColorRouter