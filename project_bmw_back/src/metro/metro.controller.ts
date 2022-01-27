import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@shared/http.error';
import { IMetroService, MetroService } from './metro.service';
import { MetroDto } from './dto/response/metro.dto';

const metroService: IMetroService = new MetroService();

// GET /api/metros
// GET /api/metros?include=stations&q=stationName=:stationName
export const getMetros = async (req: Request, res: Response, next: NextFunction) => {
  const { include, stationName } = req.dto;

  const metros: MetroDto[] =
    include && stationName
      ? await metroService.searchMetrosByStationName(stationName)
      : await metroService.findMetros(); // GET /api/metros

  req.responseData = {
    statusCode: 200,
    message: 'getMetros',
    data: metros,
  };

  return next();
};

// GET /api/metros/:routeId/stations
export const getMetroStations = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId } = req.dto;

  const metro = await metroService.findOneByIdToEntityTree(routeId);

  if (!metro) {
    throw new HttpError(404, 'getMetroStations');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getMetroStations',
    data: metro,
  };
  return next();
};

export const getArrivalInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, stationId, inOutTag } = req.dto;

  const arrival = await metroService.findArrivalInfo(routeId, stationId, inOutTag);

  req.responseData = {
    statusCode: 200,
    message: 'getArrivalInfo',
    data: arrival,
  };
  return next();
};
