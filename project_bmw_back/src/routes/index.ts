import { Router } from 'express';
import dtoValidator from '../middleware/dto.validator';
import { SignupDto } from '../user/dto/signup.dto';
import * as authController from '../auth/auth.controller';

// Auth router: /auth/*
const authRouter = Router();
authRouter.post('/signup', dtoValidator(SignupDto), authController.signup);
authRouter.post('/signin');
authRouter.get('/me');
authRouter.get('/refresh');
authRouter.get('/signout');

// User-router: /users/*
const userRouter = Router();

// base-router: /api/*
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', userRouter);
// baseRouter.use('/users', adminMW, userRouter);
export default baseRouter;
