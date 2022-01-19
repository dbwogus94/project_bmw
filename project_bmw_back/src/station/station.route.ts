import dtoValidator from '@src/middleware/dto.validator';
import { response } from '@src/middleware/response';
import { Router } from 'express';
import { SearchBusDto } from '@station/dto/request/search-bus.dto';
import { SearchStationDto } from '@station/dto/request/search-station.dto';
import { searchStationList, getSationBusList } from '@station/station.controller';

/* Station Router: /api/stops */
const stationRouter = Router();

// GET /api/stations?stationName=:stationName
stationRouter.get('/', dtoValidator(SearchStationDto), searchStationList, response);

// GET /api/stations/:stationId/buses?type=:type
stationRouter.get('/:stationId/buses', dtoValidator(SearchBusDto), getSationBusList, response);

export default stationRouter;
