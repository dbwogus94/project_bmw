import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations } from '@bus/bus.controller';
import { SearchBusDto } from '@bus/dto/request/search-bus.dto';
import { SearchStationDto } from '@bus/dto/request/search-station.dto';
import { response } from '@middleware/response';

/* Bus router: /api/buses */
const busRouter = Router();
// GET /api/buses?routeName=:routeName
busRouter.get('/', dtoValidator(SearchBusDto), getBusList, response);

// GET /api/buses/:routeId?type=:type
busRouter.get('/:routeId', dtoValidator(SearchStationDto), getBusInfo, response);

// GET /api/buses/:routeId/stations?type=:type
busRouter.get('/:routeId/stations', dtoValidator(SearchStationDto), getStations, response);

export default busRouter;
