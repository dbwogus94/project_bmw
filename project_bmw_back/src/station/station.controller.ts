import { NextFunction, Request, Response } from 'express';
import { config } from '@src/config';
import { HttpError } from '@shared/http.error';
import { getOpenApi, IOpenApi } from '@src/shared/open-api';
import { GyeonggiStationService } from './gyeonggi-station.service';
import { SeoulStationService } from './seoul-station.service';
import { StationService } from './station.service.interface';

const { gyeonggi, seoul } = config.openApi;
const openApi: IOpenApi = getOpenApi();
const gyeonggiStationService: StationService = new GyeonggiStationService(openApi, gyeonggi.station);
const seoulStationService: StationService = new SeoulStationService(openApi, seoul.station);

/**
 * GET /api/stations?stationName=:stationName
 */
export const searchStationList = async (req: Request, res: Response, next: NextFunction) => {
  const { stationName } = req.dto;

  const [gyeonggiStationList, seoulStationList] = await Promise.all([
    gyeonggiStationService.getStationListByStationName(stationName),
    seoulStationService.getStationListByStationName(stationName),
  ]);

  req.responseData = {
    statusCode: 200,
    message: 'getStationList',
    data: { gyeonggi: gyeonggiStationList, seoul: seoulStationList },
  };
  return next();
};

/**
 * GET /api/stations/:stationId/buses?type=:type
 */
export const getStationBusList = async (req: Request, res: Response, next: NextFunction) => {
  const { type, stationId } = req.dto;
  let busList;

  if (type === 'gyeonggi') {
    busList = await gyeonggiStationService.getStopBusListByStationId(stationId);
  }

  if (type === 'seoul') {
    busList = await seoulStationService.getStopBusListByStationId(stationId);
  }

  if (!busList || busList.length === 0) {
    throw new HttpError(404, 'getStationBusList');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getBusList',
    data: { busList },
  };
  return next();
};
