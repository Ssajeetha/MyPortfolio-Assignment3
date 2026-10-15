import Project from '../models/project.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

// 1. Create and Save a new Project
const create = async (req, res) => {
  const project = new Project(req.body);
  try {
    await project.save();
    return res.status(200).json({
      message: "Project successfully created!",
      project
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 2. List all Projects
const list = async (req, res) => {
  try {
    let projects = await Project.find();
    res.json(projects);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 3. Find Project by ID (Helper for read, update, delete)
const projectByID = async (req, res, next, id) => {
  try {
    let project = await Project.findById(id);
    if (!project) {
      return res.status(400).json({
        error: "Project not found"
      });
    }
    req.project = project;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve project"
    });
  }
};

// 4. Read single Project
const read = (req, res) => {
  return res.json(req.project);
};

// 5. Update a Project by ID
const update = async (req, res) => {
  try {
    let project = req.project;
    project = extend(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 6. Delete a single Project by ID
const remove = async (req, res) => {
  try {
    let project = req.project;
    let deletedProject = await project.deleteOne();
    res.json({
      message: "Project deleted successfully",
      deletedProject
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// 7. Delete ALL Projects
const removeAll = async (req, res) => {
  try {
    let result = await Project.deleteMany({});
    res.json({
      message: `${result.deletedCount} projects were deleted successfully!`
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

export default { create, list, projectByID, read, update, remove, removeAll };