import express from 'express';
import qualCtrl from '../controllers/qualification.controller.js';
import authCtrl from '../controllers/auth.controller.js'; 

const router = express.Router();

 
router.route('/api/qualifications')
  .get(qualCtrl.list)  
  .post(authCtrl.requireSignin, authCtrl.hasAdminRole, qualCtrl.create)  
  .delete(authCtrl.requireSignin, authCtrl.hasAdminRole, qualCtrl.removeAll);  

 
router.param('qualificationId', qualCtrl.qualificationByID);

 
router.route('/api/qualifications/:qualificationId')
  .get(qualCtrl.read)  
  .put(authCtrl.requireSignin, authCtrl.hasAdminRole, qualCtrl.update)  
  .delete(authCtrl.requireSignin, authCtrl.hasAdminRole, qualCtrl.remove);  

export default router;