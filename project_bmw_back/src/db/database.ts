import { config } from '@config';
import { createConnection } from 'typeorm';
/* entities */
import { User } from '@user/entities/User.entity';
import { BmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';
import { BookMark } from '@bookMark/entities/BookMark.entity';

const { database, password, host, port, user } = config.mysql;

export async function getConnection() {
  return createConnection({
    type: 'mysql',
    host,
    port,
    username: user,
    password,
    database,
    entities: [User, BmGroup, BmGroupBookMark, BookMark],
    logging:
      config.environment === 'development'
        ? [
            'query', // 모든 쿼리 기록
            'migration',
            'schema', // 스키마 빌드 기록
            'error', // 모든 에러 기록
            'warn', // 내부 orm 경고 기록
            'info', // 내부 orm 정보 메세지 기록
            'log', // 내부 orm 모든 메세지 기록
          ]
        : false,
    maxQueryExecutionTime: 1000, // 쿼리 시간이 1000보다 오래걸리면 기록
    // dropSchema: true, // 시작시 drop
    // synchronize: true, // 시작시 create
    // 한국 시간
    timezone: '+09:00',
    cli: {
      entitiesDir: 'src/db/entities',
      migrationsDir: 'src/db/migrations',
      subscribersDir: 'src/db/subscriber',
    },
  });
}
