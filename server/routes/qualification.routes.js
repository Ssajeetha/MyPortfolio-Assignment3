import express from 'express';
import qualCtrl from '../controllers/qualification.controller.js';

const router = express.Router();

router.route('/api/qualifications')
  .get(qualCtrl.list)
  .post(qualCtrl.create)
  .delete(qualCtrl.removeAll);

router.param('qualificationId', qualCtrl.qualificationByID);

router.route('/api/qualifications/:qualificationId')
  .get(qualCtrl.read)
  .put(qualCtrl.update)
  .delete(qualCtrl.remove);

export default router;