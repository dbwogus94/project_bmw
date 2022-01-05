import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations } from '@bus/bus.controller';
import { SearchBusDto } from '@bus/dto/request/search-bus.dto';
import { SearchStationDto } from '@bus/dto/request/search-station.dto';

/* Bus router: /api/buses */
const busRouter = Router();
// GET /api/buses?routeName=:routeName
busRouter.get('/', dtoValidator(SearchBusDto), getBusList);

// GET /api/buses/:routeId?type=:type
busRouter.get('/:routeId', dtoValidator(SearchStationDto), getBusInfo);

// GET /api/buses/:routeId/stations?type=:type
busRouter.get('/:routeId/stations', dtoValidator(SearchStationDto), getStations);

export default busRouter;
