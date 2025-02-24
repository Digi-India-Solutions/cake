const express = require('express');
const { createContact, getAllContacts, deleteContact } = require('../Controller/contactController');
const ContactRouter = express.Router();

ContactRouter.post('/send-query', createContact);
ContactRouter.get("/contacts", getAllContacts);

// Delete a contact by ID
ContactRouter.delete("/contact/:id", deleteContact);

module.exports = ContactRouter;
