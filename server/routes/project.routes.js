import express from 'express';
import projectCtrl from '../controllers/project.controller.js';

const router = express.Router();

// Routes for all projects (/api/projects)
router.route('/api/projects')
  .get(projectCtrl.list)
  .post(projectCtrl.create)
  .delete(projectCtrl.removeAll);

// Parameter helper: whenever :projectId is in the URL, automatically find that project
router.param('projectId', projectCtrl.projectByID);

// Routes for a single project (/api/projects/:projectId)
router.route('/api/projects/:projectId')
  .get(projectCtrl.read)
  .put(projectCtrl.update)
  .delete(projectCtrl.remove);

export default router;