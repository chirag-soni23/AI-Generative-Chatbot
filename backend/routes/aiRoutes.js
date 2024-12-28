import {Router} from 'express';
import * as aiController from '../controllers/aiController.js';

const router = Router();

router.get('/get-result',aiController.getResult)

export default router;