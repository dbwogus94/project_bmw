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
  },
  logger: {
    mode: required('JET_LOGGER_MODE'),
    filePath: required('JET_LOGGER_FILEPATH'),
    timestamp: required('JET_LOGGER_TIMESTAMP'),
    format: required('JET_LOGGER_FORMAT'),
  },
  cookie: {
    key: required('COOKIE_KEY'),
    // cookieParser에 적용할 쿠키 암호화 키
    secret: required('COOKIE_SECRET'),
    options: {
      httpOnly: true,
      signed: true,
      path: required('COOKIE_PATH'),
      // 만료일, accessJwt와 동일
      maxAge: Number(required('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
      domain: required('COOKIE_DOMAIN'),
      // https에서만 유효
      secure: required('SECURE_COOKIE') === 'true',
    },
  },
  jwt: {
    access: {
      secret: required('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: required('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      issuer: required('JWT_ISSUER'),
    },
    refresh: {
      secret: required('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: required('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      issuer: required('JWT_ISSUER'),
    },
  },
  bcrypt: {
    salt: Number(required('BCRYPT_SALT')),
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
  },
});
