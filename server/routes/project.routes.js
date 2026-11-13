import express from 'express';
import projectCtrl from '../controllers/project.controller.js';
import authCtrl from '../controllers/auth.controller.js'; 

const router = express.Router();

 
router.route('/api/projects')
  .get(projectCtrl.list) 
  .post(authCtrl.requireSignin, authCtrl.hasAdminRole, projectCtrl.create) 
  .delete(authCtrl.requireSignin, authCtrl.hasAdminRole, projectCtrl.removeAll);


router.param('projectId', projectCtrl.projectByID);

 
router.route('/api/projects/:projectId')
  .get(projectCtrl.read) 
  .put(authCtrl.requireSignin, authCtrl.hasAdminRole, projectCtrl.update) 
  .delete(authCtrl.requireSignin, authCtrl.hasAdminRole, projectCtrl.remove); 

export default router;