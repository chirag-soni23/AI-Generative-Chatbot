import { Router } from 'express';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/authMiddleware.js';
import * as projectController from '../controllers/projectController.js';

const router = Router();

router.post(
    '/create',authMiddleware.authUser,
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
            .isString()
            .withMessage('Name must be a string'),
    ],
    projectController.createProject
);

router.get('/all',authMiddleware.authUser,projectController.getAllProject)
export default router;
