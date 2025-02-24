const express = require('express');
const { createCategoryTitel, getAllCategoryTitels, getCategoryTitelById, updateCategoryTitel, deleteCategoryTitel } = require('../Controller/CategoryTitelController');
const CategoryTitelRouter = express.Router();


// Define the routes for the controller
CategoryTitelRouter.post('/create-categoryTitel', createCategoryTitel);
CategoryTitelRouter.get('/get-categoryTitels', getAllCategoryTitels);
CategoryTitelRouter.get('/signle-categoryTitel/:id', getCategoryTitelById);
CategoryTitelRouter.put('/update-categoryTitel/:id', updateCategoryTitel);
CategoryTitelRouter.delete('/delete-categoryTitel/:id', deleteCategoryTitel);

module.exports = CategoryTitelRouter;
