import { Router } from 'express';
import authRouter from './auth.route';
import busRouter from './bus.route';

/* base-router: /api/* */
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/bus', busRouter);
export default baseRouter;
