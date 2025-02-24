const express = require('express');
const { createTag, getAllTags, getSingleTag, updateTag, deleteTag } = require('../Controller/tagController');
const TagRouter = express.Router();


// Route to create a tag
TagRouter.post('/add-tags', createTag);
TagRouter.get('/get-tags', getAllTags);
TagRouter.get('/get-single-tags/:id', getSingleTag);
TagRouter.put('/update-tags/:id', updateTag);
TagRouter.delete('/delete-tags/:id', deleteTag);

module.exports = TagRouter;
