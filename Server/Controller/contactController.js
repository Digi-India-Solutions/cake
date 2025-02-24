const ContactModel = require("../Model/ContactModel");


// Create a new contact record
exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate the input
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Save the data
        const contact = new ContactModel({ name, email, subject, message });
        await contact.save();

        return res.status(201).json({
            success: true,
            message: 'Your message has been submitted successfully',
            data: contact,
        });
    } catch (error) {
        console.error('Error creating contact:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// Get all contact records
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find();
        return res.status(200).json({
            success: true,
            data: contacts.reverse(),
        });
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the contact and delete it
        const contact = await ContactModel.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting contact:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
