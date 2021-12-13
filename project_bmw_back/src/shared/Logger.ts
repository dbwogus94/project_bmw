import { config } from '@config';
import winston, { Logger } from 'winston';
// 날짜별로 윈스턴 로그 저장 기능을 지원하는 모듈
import winstonDaily from 'winston-daily-rotate-file';

const { environment, log } = config;
// 로그가 저장될 폴더 : ./logs
const { logDir, errLogDir, logLable } = log;

/**
 * winston에 설정할 커스텀 로그 우선순위 목록 정의
 */
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  // http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * 환경에 따른 출력 레벨 설정
 * @returns
 */
const level = () => {
  return environment === 'development' //
    ? 'debug'
    : 'warn';
};

/**
 * 로그 레벨에 따라 사용할 색상 설정
 */
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  // http: 'magenta',
  verbose: 'blue',
  debug: 'white',
  silly: 'white',
});

const { combine, timestamp, printf, label, errors, prettyPrint } = winston.format;
const colorize = winston.format.colorize({ all: true });
/**
 * 로그 포멧 설정
 * @param path 로그에 붙일 라벨_명
 * @returns
 */
const format = () =>
  combine(
    label({ label: logLable }),
    errors({ stack: true }), // 1) 에러 스택 모두 출력 설정
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // prettyPrint(),
    printf(({ level, message, label, timestamp, stack }) => {
      return stack // 2) 에러 스택 모두 출력 설정
        ? `${colorize.colorize(level, `[${timestamp}] [${level.toUpperCase()}] ${label ?? ''}:`)} ${stack}`
        : `${colorize.colorize(level, `[${timestamp}] [${level.toUpperCase()}] ${label ?? ''}:`)} ${message}`;
    }),
  );

/**
 * 운영 환경 로그 저장 위치 설정
 * @returns
 */
const transports = () => [
  /* info 레벨 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD', // 파일명 날짜 형식 패턴
    dirname: logDir,
    filename: `%DATE%.log`, // ex) 2021-12-11.log
    maxFiles: 30, // 30일치 로그 파일 저장
    zippedArchive: true,
  }),
  /* error 레벨 로그를 저장할 파일 설정 */
  new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: errLogDir, // error.log 파일은 /logs/error 하위에 저장
    filename: `%DATE%.error.log`, // ex) 2021-12-11.error.log
    maxFiles: 30,
    zippedArchive: true,
  }),
];

/**
 * 개발 환경 로그 저장위치 설정 => 콘솔에 출력
 * @returns
 */
const devTransports = () => [new winston.transports.Console()];

// let logger: Logger | null = null;
/**
 * 실제 사용될 winston 로거 생성
 * @param path 로그에 붙일 라벨_명
 * @returns
 */
const logger = (() => {
  return winston.createLogger({
    // 설정한 로그 레벨 이하만 출력
    level: level(),
    // 커스텀 레벨 목록 설정
    levels,
    // 출력 포멧
    format: format(),
    // 출력된 로그 어디로 보낼지 설정
    transports:
      environment === 'development' //
        ? devTransports() // 콘솔
        : transports(), // 파일
  });
})();

/**
 * 생성된 winston 로거 리턴
 * @returns
 */
export const getLogger = (): Logger => {
  return logger;
};
