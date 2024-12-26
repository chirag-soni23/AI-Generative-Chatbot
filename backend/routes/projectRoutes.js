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

router.get('/all',authMiddleware.authUser,projectController.getAllProject);

router.put('/add-user',authMiddleware.authUser,body('projectId').isString().withMessage("Project Id is required"),body('users').isArray({min:1}).withMessage("Users must be an array of strings").bail().custom((users)=>users.every(user =>typeof user === 'string')).withMessage('Each user must be a string'),projectController.addUserToProject);


export default router;
