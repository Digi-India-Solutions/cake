const { createFlover, getAllFlowers, getSingleFlover, updateFlover, deleteFlover } = require("../Controller/FloverController")

const FloverRouter = require("express").Router()

FloverRouter.post("/create-flover" ,createFlover)
FloverRouter.get("/get-flover" ,getAllFlowers)
FloverRouter.get("/get-single-flover/:id" ,getSingleFlover)
FloverRouter.put("/update-flover/:id" ,updateFlover)
FloverRouter.delete("/delete-flover/:id" ,deleteFlover)

module.exports = FloverRouter