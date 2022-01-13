import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { SignupDto } from '@user/dto/signup.dto';
import { SigninDto } from '@user/dto/signin.dto';
import { me, refreshToken, signin, signout, signup } from '@auth/auth.controller';
import { RefreshDto } from '@user/dto/refresh.dto';
import { isAuth } from '@middleware/auth';
import { response } from '@middleware/response';

/* Auth router: /auth/* */
const authRouter = Router();
authRouter.post('/signup', dtoValidator(SignupDto), signup);
authRouter.post('/signin', dtoValidator(SigninDto), signin, response);
// auth/me
authRouter.get('/me', isAuth, me, response);
// auth/refresh
authRouter.get('/refresh', refreshToken, response);
// auth/signout
authRouter.get('/signout', isAuth, signout, response);

export default authRouter;
