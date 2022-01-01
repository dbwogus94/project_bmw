import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { XMLParser } from 'fast-xml-parser';
import { config } from '@config';
import { errorMessages } from '@shared/message';
import { OpenApi } from '@shared/open.api';
import { GyeonggiBusService } from '@bus/gyeonggi.bus.service';
import { SeoulBusService } from './seoul.bus.service';

const { OK, NOT_FOUND } = StatusCodes;
const { NOT_FOUND_MESSAGE } = errorMessages;
const { gyeonggi, seoul } = config.openApi;

// 의존성 주입
const parser = new XMLParser();
const openApi = new OpenApi(parser);
const gyeonggiBusService = new GyeonggiBusService(openApi, gyeonggi);
const seoulBusService = new SeoulBusService(openApi, seoul);

// GET /bus?routeName=:routeName
export const getBusList = async (req: Request, res: Response, next: NextFunction) => {
  const { routeName } = req.dto;
  // 경기도, 서울시 동시 조회
  const [gyeonggiBusList, seoulBusList] = await Promise.all([
    gyeonggiBusService.getBusListByRouteName(routeName),
    seoulBusService.getBusListByRouteName(routeName),
  ]);

  return res.status(OK).json({ gyeonggi: gyeonggiBusList, seoul: seoulBusList });
};

// GET /bus/:routeId?type=:type
export const getBusInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, type } = req.dto;
  let info;

  if (type === 'gyeonggi') {
    info = await gyeonggiBusService.getBusInfoByRouteId(routeId);
  }

  if (type === 'seoul') {
    info = await seoulBusService.getBusInfoByRouteId(routeId);
  }

  return info //
    ? res.status(OK).json({ routeId, type, info })
    : res.status(NOT_FOUND).json({
        errCode: NOT_FOUND_MESSAGE,
        message: NOT_FOUND_MESSAGE.getBusInfo,
      });
};

// GET /bus/:routeId/stations?type=:type
export const getStations = async (req: Request, res: Response, next: NextFunction) => {
  const { routeId, type } = req.dto;
  let stationList;

  if (type === 'gyeonggi') {
    stationList = await gyeonggiBusService.getStationsByRouteId(routeId);
  }

  if (type === 'seoul') {
    stationList = await seoulBusService.getStationsByRouteId(routeId);
  }

  return stationList && stationList.length !== 0
    ? res.status(OK).json({ routeId, type, stationList })
    : res.status(NOT_FOUND).json({
        errCode: NOT_FOUND_MESSAGE,
        message: NOT_FOUND_MESSAGE.getStations,
      });
};
