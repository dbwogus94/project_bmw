import { NextFunction, Request, Response } from 'express';
import { XMLParser } from 'fast-xml-parser';
import { config } from '@config';
import { OpenApi } from '@shared/open-api';
import { GyeonggiBusService } from '@bus/gyeonggi-bus.service';
import { SeoulBusService } from './seoul-bus.service';
import { HttpError } from '@shared/http.error';

const { gyeonggi, seoul } = config.openApi;

// 의존성 주입
const parser = new XMLParser();
const openApi = new OpenApi(parser);
const gyeonggiBusService = new GyeonggiBusService(openApi, gyeonggi);
const seoulBusService = new SeoulBusService(openApi, seoul);

// GET /api/buses?routeName=:routeName
export const getBusList = async (req: Request, res: Response, next: NextFunction) => {
  const { routeName } = req.dto;
  // 경기도, 서울시 동시 조회
  const [gyeonggiBusList, seoulBusList] = await Promise.all([
    gyeonggiBusService.getBusListByRouteName(routeName),
    seoulBusService.getBusListByRouteName(routeName),
  ]);

  req.responseData = {
    statusCode: 200,
    message: 'getBusList',
    data: { gyeonggi: gyeonggiBusList, seoul: seoulBusList },
  };
  return next();
};

// GET /api/buses/:routeId?type=:type
export const getBusInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, type } = req.dto;
  let info;

  if (type === 'gyeonggi') {
    info = await gyeonggiBusService.getBusInfoByRouteId(routeId);
  }

  if (type === 'seoul') {
    info = await seoulBusService.getBusInfoByRouteId(routeId);
  }

  if (!info) {
    throw new HttpError(404, 'getBusInfo');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getBusInfo',
    data: { routeId, type, info },
  };
  return next();
};

// GET /api/buses/:routeId/stations?type=:type
export const getStations = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, type } = req.dto;
  let stationList;

  if (type === 'gyeonggi') {
    stationList = await gyeonggiBusService.getStationsByRouteId(routeId);
  }

  if (type === 'seoul') {
    stationList = await seoulBusService.getStationsByRouteId(routeId);
  }

  if (!stationList || stationList.length === 0) {
    throw new HttpError(404, 'getStations');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getStations',
    data: { routeId, type, stationList },
  };
  return next();
};
