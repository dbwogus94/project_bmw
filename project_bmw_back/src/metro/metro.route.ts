import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { response } from '@middleware/response';
import { SearchMetroDto } from './dto/request/search-metro.dto';
import { GetMetroStation } from './dto/request/get-metro-station.dto';
import { getMetros, getMetroStations, getArrivalInfo } from './metro.controller';
import { GetMetroArrivalDto } from './dto/request/get-metro-arrival.dto';

/* metro router: api/metros */
const metroRouter = Router();

// GET /api/metros
// GET /api/metros?include=stations&q=stationName=:stationName
metroRouter.get('/', dtoValidator(SearchMetroDto), getMetros, response);

// GET /api/metros/:routeId/stations/:stationId/arrival?inOutTag:inOutTag
metroRouter.get('/:routeId/stations/:stationId/arrival', dtoValidator(GetMetroArrivalDto), getArrivalInfo, response);

// GET /api/metros/:routeId/stations
metroRouter.get('/:routeId/stations', dtoValidator(GetMetroStation), getMetroStations, response);

export default metroRouter;
