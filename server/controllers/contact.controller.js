import Contact from '../models/contact.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

// 1. Create new Contact
const create = async (req, res) => {
  const contact = new Contact(req.body);
  try {
    await contact.save();
    return res.status(200).json({
      message: "Contact successfully created!",
      contact
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 2. List all Contacts
const list = async (req, res) => {
  try {
    let contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 3. Find Contact by ID
const contactByID = async (req, res, next, id) => {
  try {
    let contact = await Contact.findById(id);
    if (!contact) {
      return res.status(400).json({
        error: "Contact not found"
      });
    }
    req.contact = contact;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve contact"
    });
  }
};

// 4. Read single Contact
const read = (req, res) => {
  return res.json(req.contact);
};

// 5. Update Contact
const update = async (req, res) => {
  try {
    let contact = req.contact;
    contact = extend(contact, req.body);
    await contact.save();
    res.json(contact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 6. Delete single Contact
const remove = async (req, res) => {
  try {
    let contact = req.contact;
    let deletedContact = await contact.deleteOne();
    res.json({
      message: "Contact deleted successfully",
      deletedContact
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 7. Delete ALL Contacts
const removeAll = async (req, res) => {
  try {
    let result = await Contact.deleteMany({});
    res.json({
      message: `${result.deletedCount} contacts were deleted successfully!`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

export default { create, list, contactByID, read, update, remove, removeAll };