import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { SignupDto } from '@user/dto/signup.dto';
import { SigninDto } from '@user/dto/signin.dto';
import { me, refreshToken, signin, signout, signup } from '@auth/auth.controller';
import { RefreshDto } from '@user/dto/refresh.dto';
import { isAuth } from '@middleware/auth';

/* Auth router: /auth/* */
const authRouter = Router();
authRouter.post('/signup', dtoValidator(SignupDto), signup);
authRouter.post('/signin', dtoValidator(SigninDto), signin);
// auth/me?username=:username
authRouter.get('/me', dtoValidator(RefreshDto), isAuth, me);
// auth/refresh?username=:username
authRouter.get('/refresh', dtoValidator(RefreshDto), refreshToken);
// auth/signout
authRouter.get('/signout', isAuth, signout);

export default authRouter;
