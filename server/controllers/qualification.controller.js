import Qualification from '../models/qualification.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

// 1. Create a Qualification
const create = async (req, res) => {
  const qualification = new Qualification(req.body);
  try {
    await qualification.save();
    return res.status(200).json({
      message: "Qualification successfully created!",
      qualification
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 2. List all Qualifications
const list = async (req, res) => {
  try {
    let qualifications = await Qualification.find();
    res.json(qualifications);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 3. Find Qualification by ID
const qualificationByID = async (req, res, next, id) => {
  try {
    let qualification = await Qualification.findById(id);
    if (!qualification) {
      return res.status(400).json({
        error: "Qualification not found"
      });
    }
    req.qualification = qualification;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve qualification"
    });
  }
};

// 4. Read single Qualification
const read = (req, res) => {
  return res.json(req.qualification);
};

// 5. Update a Qualification
const update = async (req, res) => {
  try {
    let qualification = req.qualification;
    qualification = extend(qualification, req.body);
    await qualification.save();
    res.json(qualification);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 6. Delete a single Qualification
const remove = async (req, res) => {
  try {
    let qualification = req.qualification;
    let deletedQualification = await qualification.deleteOne();
    res.json({
      message: "Qualification deleted successfully",
      deletedQualification
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 7. Delete ALL Qualifications
const removeAll = async (req, res) => {
  try {
    let result = await Qualification.deleteMany({});
    res.json({
      message: `${result.deletedCount} qualifications were deleted successfully!`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

export default { create, list, qualificationByID, read, update, remove, removeAll };