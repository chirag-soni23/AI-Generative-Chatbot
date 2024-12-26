import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// register route
router.post('/register',
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({ min: 3 }).withMessage("Password must be at a 3 character long"),
    userController.createUserController);

// login route
router.post('/login',
    body('email').isEmail().withMessage("Email must be a valid email address"),
    body('password').isLength({ min: 3 }).withMessage("Password must be at a 3 character long"),
    userController.loginController);

// profile route
router.get('/profile',authMiddleware.authUser,userController.profileController);

// logout route
router.get('/logout',authMiddleware.authUser,userController.logoutController);

// get all user
router.get('/all',authMiddleware.authUser,userController.getAllUserController)


export default router;