import { join } from 'path';

function required(key: string | number, defaultValue: any = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

export const config = Object.freeze({
  environment: required('NODE_ENV', 'development'),
  server: {
    port: required('PORT', 8080),
    host: required('HOST', 'localhost'),
    cors: {
      // 같은 도메인 다른 포트에서 쿠키를 공유하기 위한 설정
      origin: true,
      credentials: true,
    },
  },
  log: {
    logDir: required('LOG_DIR'),
    errLogDir: join(required('LOG_DIR'), required('ERR_LOG_DIR')),
    httpLogDir: join(required('LOG_DIR'), required('HTTP_LOG_DIR')),
  },
  cookie: {
    key: required('COOKIE_KEY'),
    // cookieParser에 적용할 쿠키 암호화 키
    secret: required('COOKIE_SECRET'),
    options: {
      httpOnly: true,
      signed: true,
      path: required('COOKIE_PATH'),
      // 만료일, refreshJwt와 동일하게 설정 **단위 ms(밀리세컨드)
      maxAge: Number(required('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '1209600')) * 1000, // 14d
      domain: required('COOKIE_DOMAIN'),
      // https에서만 유효, **booean형으로 리턴되게 해야한다.
      secure: required('SECURE_COOKIE') === 'true',
    },
  },
  jwt: {
    access: {
      secret: required('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: Number(required('JWT_ACCESS_TOKEN_EXPIRATION_TIME', '3600')), // 1h
      issuer: required('JWT_ISSUER'),
    },
    refresh: {
      secret: required('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: Number(required('JWT_REFRESH_TOKEN_EXPIRATION_TIME', '1209600')), // 14d
      issuer: required('JWT_ISSUER'),
    },
  },
  bcrypt: {
    salt: Number(required('BCRYPT_SALT', '10')),
  },
  mysql: {
    host: required('DB_HOST', 'localhost'),
    port: required('DB_PORT', '13306'),
    database: required('DB_DATABASE'),
    user: required('DB_USERNAME', 'root'),
    password: required('DB_PASSWORD'),
  },
  redis: {
    name: required('REDIS_NAME'),
    url: required('REDIS_URL'),
    password: required('REDIS_PASSWORD'),
  },
});
