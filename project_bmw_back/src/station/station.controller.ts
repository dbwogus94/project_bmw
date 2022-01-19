import { HttpError } from '@shared/http.error';
import { config } from '@src/config';
import { OpenApi } from '@src/shared/open-api';
import { NextFunction, Request, Response } from 'express';
import { XMLParser } from 'fast-xml-parser';
import { GyeonggiStationService } from './gyeonggi-station.service';
import { SeoulStationService } from './seoul-station.service';

const { gyeonggi, seoul } = config.openApi;
const parser = new XMLParser();
const openApi = new OpenApi(parser);
const gyeonggiStationService = new GyeonggiStationService(openApi, gyeonggi.station);
const seoulStationService = new SeoulStationService(openApi, seoul.station);

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
export const getSationBusList = async (req: Request, res: Response, next: NextFunction) => {
  const { type, stationId } = req.dto;
  let busList;

  if (type === 'gyeonggi') {
    busList = await gyeonggiStationService.getStopBusListByStationId(stationId);
  }

  if (type === 'seoul') {
    busList = await seoulStationService.getStopBusListByStationId(stationId);
  }

  if (!busList || busList.length === 0) {
    throw new HttpError(404, 'getSationBusList');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getBusList',
    data: { busList },
  };
  return next();
};
