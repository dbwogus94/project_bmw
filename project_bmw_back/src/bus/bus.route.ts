import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations } from '@bus/bus.controller';
import { BusSearchDto } from '@bus/dto/request/bus.search.dto';
import { StationDto } from '@bus/dto/request/station.search.dto';

/* Bus router: /api/buses */
const busRouter = Router();
// GET /api/buses?routeName=:routeName
busRouter.get('/', dtoValidator(BusSearchDto), getBusList);

// GET /api/buses/:routeId?type=:type
busRouter.get('/:routeId', dtoValidator(StationDto), getBusInfo);

// GET /api/buses/:routeId/stations?type=:type
busRouter.get('/:routeId/stations', dtoValidator(StationDto), getStations);

export default busRouter;
