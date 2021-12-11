/**
 * winston.js
 */

import { config } from '@config';
import winston, { Logger } from 'winston';
// 날짜별로 윈스턴 로그 저장 기능을 지원하는 모듈
import winstonDaily from 'winston-daily-rotate-file';

const { environment, log } = config;
// 로그가 저장될 폴더 : ./logs
const { httpLogDir } = log;

/**
 * 로그 레벨에 따라 사용할 색상 설정
 */
winston.addColors({
  http: 'magenta',
});

const { combine, timestamp, printf, label } = winston.format;
const colorize = winston.format.colorize({ all: true });

/**
 * 로그 포멧 설정
 * @param path 로그에 붙일 라벨_명
 * @returns
 */
const format = (path: string) =>
  combine(
    label({ label: path }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // prettyPrint(),
    printf(({ level, message, label, timestamp }) => {
      return `${colorize.colorize(level, `[${timestamp}] [${level.toUpperCase()}] ${label ?? ''}:`)} ${message}`;
    }),
  );

/**
 * 운영 환경 로그 저장 위치 설정
 * @returns
 */
const transports = () => [
  /* http 레벨 로그 저장 파일 설정 */
  new winstonDaily({
    level: 'http',
    datePattern: 'YYYY-MM-DD', // 파일명 날짜 형식 패턴
    dirname: httpLogDir,
    filename: `%DATE%.http.log`, // ex) 2021-12-11.http.log
    maxFiles: 30, // 30일치 로그 파일 저장
    zippedArchive: true,
  }),
];

/**
 * 개발 환경 로그 저장위치 설정 => 콘솔에 출력
 * @returns
 */
const devTransports = () => [new winston.transports.Console()];

let logger: Logger | null = null;

/**
 * 실제 사용될 winston 로거 생성
 * @returns
 */
export const createHttpLogger = (path: string): void => {
  if (!logger) {
    logger = winston.createLogger({
      level: 'http',
      format: format(path),
      // 출력된 로그 어디로 보낼지 설정
      transports:
        environment === 'development' //
          ? devTransports() // 콘솔
          : transports(), // 파일
    });
  }
};

/**
 * 생성된 winston 로거 리턴
 * @returns
 */
export const getHttpLogger = (): Logger => {
  if (!logger) {
    throw new Error('init error - first call createHttpLogger');
  }
  return logger;
};
