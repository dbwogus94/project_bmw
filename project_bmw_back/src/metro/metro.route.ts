import { Router } from 'express';
import dtoValidator from '@middleware/dto.validator';
import { response } from '@middleware/response';
import { SearchMetroDto } from './dto/request/search-metro.dto';
import { GetMetroStation } from './dto/request/get-metro-station.dto';
import { getMetros, getMetroStations } from './metro.controller';

/* metro router: api/metros */
const metroRouter = Router();

// GET /api/metros
// GET /api/metros?include=stations&q=stationName=:stationName
metroRouter.get('/', dtoValidator(SearchMetroDto), getMetros, response);

// GET /api/metros/:metroId/stations
metroRouter.get('/:metroId/stations', dtoValidator(GetMetroStation), getMetroStations, response);

export default metroRouter;
