import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { SignupDto } from '@user/dto/signup.dto';
import { SigninDto } from '@user/dto/signin.dto';
import * as authController from '@auth/auth.controller';
import { RefreshDto } from '@user/dto/refresh.dto';
import { isAuth } from '@middleware/auth';

// Auth router: /auth/*
const authRouter = Router();
authRouter.post('/signup', dtoValidator(SignupDto), authController.signup);
authRouter.post('/signin', dtoValidator(SigninDto), authController.signin);
// auth/me?username=:username
authRouter.get('/me', dtoValidator(RefreshDto), isAuth, authController.me);
// auth/refresh?username=:username
authRouter.get('/refresh', dtoValidator(RefreshDto), authController.refreshToken);
// auth/signout
authRouter.get('/signout', isAuth, authController.signout);

// User-router: /users/*
const userRouter = Router();

// base-router: /api/*
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', userRouter);
// baseRouter.use('/users', adminMW, userRouter);
export default baseRouter;
