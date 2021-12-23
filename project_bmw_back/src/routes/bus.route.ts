import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { busList } from '@bus/bus.controller';
import { BusSearchDto } from '@bus/dto/request/bus.search.dto';

/* Bus router: /bus */
const busRouter = Router();
// /bus?routeName=:routeName
busRouter.get('/', dtoValidator(BusSearchDto), busList); // dto 만들까? 말까?

export default busRouter;
