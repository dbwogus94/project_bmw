import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations } from '@bus/bus.controller';
import { BusSearchDto } from '@bus/dto/request/bus.search.dto';
import { StationDto } from '@bus/dto/request/station.search.dto';

/* Bus router: /api/bus */
const busRouter = Router();
// GET /bus?routeName=:routeName
busRouter.get('/', dtoValidator(BusSearchDto), getBusList);

// GET /bus/:type/:routeId
busRouter.get('/:type/:routeId', dtoValidator(StationDto), getBusInfo);

// GET /bus/:type/:routeId/stations
busRouter.get('/:type/:routeId/stations', dtoValidator(StationDto), getStations);

export default busRouter;
