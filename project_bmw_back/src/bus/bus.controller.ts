import { NextFunction, Request, Response } from 'express';
import { config } from '@config';
import { getOpenApi, IOpenApi } from '@shared/open-api';
import { GyeonggiBusService } from '@bus/gyeonggi-bus.service';
import { SeoulBusService } from './seoul-bus.service';
import { HttpError } from '@shared/http.error';
import { BusService } from './bus.service.interface';

const { gyeonggi, seoul } = config.openApi;

// 의존성 주입
const openApi: IOpenApi = getOpenApi();
const gyeonggiBusService: BusService = new GyeonggiBusService(openApi, gyeonggi);
const seoulBusService: BusService = new SeoulBusService(openApi, seoul);

// GET /api/buses?routeName=:routeName
export const searchBusList = async (req: Request, res: Response, next: NextFunction) => {
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
  let stations;

  if (type === 'gyeonggi') {
    stations = await gyeonggiBusService.getStationsByRouteId(routeId);
  }

  if (type === 'seoul') {
    stations = await seoulBusService.getStationsByRouteId(routeId);
  }

  if (!stations || stations.length === 0) {
    throw new HttpError(404, 'getStations');
  }

  req.responseData = {
    statusCode: 200,
    message: 'getStations',
    data: { routeId, type, stations },
  };
  return next();
};

// GET /api/buses/arrival?type=:type&stationId=:stationId&routeId=:routeId&stationSeq=:stationSeq
export const getArrivalInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, stationId, stationSeq, type } = req.dto;
  let arrival;

  if (type === 'gyeonggi') {
    arrival = await gyeonggiBusService.getArrivalInfo(routeId, stationId, stationSeq);
  }

  if (type === 'seoul') {
    arrival = await seoulBusService.getArrivalInfo(routeId, stationId, stationSeq);
  }

  req.responseData = {
    statusCode: 200,
    message: 'getArrivalInfo',
    data: { routeId, type, arrival },
  };
  return next();
};
