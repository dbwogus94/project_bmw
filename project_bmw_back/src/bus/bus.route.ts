import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations } from '@bus/bus.controller';
import { BusSearchDto } from '@bus/dto/request/bus.search.dto';
import { StationDto } from '@bus/dto/request/station.search.dto';

/* Bus router: /api/bus */
const busRouter = Router();
// GET /bus?routeName=:routeName
busRouter.get('/', dtoValidator(BusSearchDto), getBusList);

// GET /bus/:routeId?type=:type
busRouter.get('/:routeId', dtoValidator(StationDto), getBusInfo);

// GET /bus/:routeId/stations?type=:type
busRouter.get('/:routeId/stations', dtoValidator(StationDto), getStations);

export default busRouter;
