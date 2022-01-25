import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@shared/http.error';
import { IMetroService, MetroService } from './metro.service';
import { MetroDto } from './dto/response/metro.dto';

const metroServcie: IMetroService = new MetroService();

// GET /api/metros
// GET /api/metros?include=stations&q=stationName=:stationName
export const getMetros = async (req: Request, res: Response, next: NextFunction) => {
  const { include, stationName } = req.dto;

  const metros: MetroDto[] =
    include && stationName
      ? await metroServcie.searchMetrosByStationName(stationName)
      : await metroServcie.findMetros(); // GET /api/metros

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

  const metro = await metroServcie.findOneByIdToEntityTree(routeId);

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
