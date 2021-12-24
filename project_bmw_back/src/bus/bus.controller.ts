import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { XMLParser } from 'fast-xml-parser';
import { config } from '@config';
import { OpenApi } from '@shared/open.api';
import { GyeonggiBusService } from '@bus/gyeonggi.bus.service';
import { SeoulBusService } from './seoul.bus.service';

const { OK } = StatusCodes;
const { gyeonggi, seoul } = config.openApi;

const parser = new XMLParser();
const openApi = new OpenApi(parser);
const gyeonggiBusService = new GyeonggiBusService(openApi, gyeonggi);
const seoulBusService = new SeoulBusService(openApi, seoul);

export const busList = async (req: Request, res: Response, next: NextFunction) => {
  const { routeName } = req.dto;
  // 경기도, 서울시 동시 조회
  const [gyeonggiBusList, seoulBusList] = await Promise.all([
    gyeonggiBusService.getBusListByRouteName(routeName),
    seoulBusService.getBusListByRouteName(routeName),
  ]);

  return res.status(OK).json({ gyeonggi: gyeonggiBusList, seoul: seoulBusList });
};
