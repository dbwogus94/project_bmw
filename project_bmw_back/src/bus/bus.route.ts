import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { getBusList, getBusInfo, getStations, getArrivalInfo } from '@bus/bus.controller';
import { SearchBusDto } from '@bus/dto/request/search-bus.dto';
import { SearchStationDto } from '@bus/dto/request/search-station.dto';
import { response } from '@middleware/response';
import { GetArrialInfoDto } from './dto/request/get-arrival-time.dto';

/* Bus router: /api/buses */
const busRouter = Router();
// GET /api/buses?routeName=:routeName
busRouter.get('/', dtoValidator(SearchBusDto), getBusList, response);

// GET /api/buses/arrival?type=:type&stationId=:stationId&routeId=:routeId&stationSeq=:stationSeq
busRouter.get('/arrival', dtoValidator(GetArrialInfoDto), getArrivalInfo, response);

// GET /api/buses/:routeId?type=:type
busRouter.get('/:routeId', dtoValidator(SearchStationDto), getBusInfo, response);

// GET /api/buses/:routeId/stations?type=:type
busRouter.get('/:routeId/stations', dtoValidator(SearchStationDto), getStations, response);

export default busRouter;
