import { createConnection } from 'typeorm';
/* entities */
import { User } from '@user/entities/User.entity';
import { BmGroup } from '@bmGroup/entities/BmGroup.entity';
import { BmGroupBookMark } from '@bmGroupBookMark/entities/BmGroupBookMark.entity';
import { BookMark } from '@bookMark/entities/BookMark.entity';
import { CustomNamingStrategy } from './typeorm/custom-naming-strategy';
import { join } from 'path';

interface IMysqlConfig {
  database: string;
  password: string;
  host: string;
  port: string;
  username: string;
}

/**
 * typeOrm config를 얻는다.
 * @param environment - 운영 환경
 * @param mysql - mysql 설정 정보
 * @param isSynchronize - typeorm 시작시 동기화 사용 유무
 * @param isDropSchema - typeorm 시작시 drop sql 사용 유무
 * @returns
 */
export function getTypeOrmConfig(
  environment: 'development' | 'production',
  mysqlConfig: IMysqlConfig,
  isSynchronize?: boolean,
  isDropSchema?: boolean,
): any {
  return {
    type: 'mysql',
    ...mysqlConfig,
    logging:
      environment === 'development'
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
    dropSchema: isDropSchema ? isDropSchema : false, // 시작시 drop
    synchronize: isSynchronize ? isSynchronize : false, // 시작시 create
    // 한국 시간
    timezone: '+09:00',
    entities: [User, BmGroup, BmGroupBookMark, BookMark],
    namingStrategy: new CustomNamingStrategy(),
    migrations: [
      environment === 'development'
        ? join(process.cwd(), 'src/db/typeorm/migrations/*{.ts,.js}')
        : join(process.cwd(), 'dist/db/typeorm/migrations/*{.ts,.js}'),
    ],
    cli: {
      migrationsDir: 'src/db/typeorm/migrations',
    },
  };
}

/**
 * typeOrm을 사용하여 mysql connection을 가져온다
 * @param environment - 운영 환경
 * @param mysql - mysql 설정 정보
 * @param isSynchronize - typeorm 시작시 동기화 사용 유무
 * @param isDropSchema - typeorm 시작시 drop sql 사용 유무
 * @returns
 */
export async function getConnection(
  environment: 'development' | 'production',
  mysql: IMysqlConfig,
  isSynchronize?: boolean,
  isDropSchema?: boolean,
) {
  return createConnection(getTypeOrmConfig(environment, mysql, isSynchronize, isDropSchema));
}
