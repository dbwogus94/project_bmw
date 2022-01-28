// Must be the first import
import commendOption from '../index';
import { config } from '@config';
import * as typeorm from '@db/database';
import step1InsertMetro from './step1-insert-metro';
import step2InsertTimetable from './step2-insert-timetable';
import { getOpenApi } from '@shared/open-api';

(async () => {
  const { openApi } = config;
  const { environment, mysql } = config;
  const api = getOpenApi();

  const { mode } = commendOption;

  const isSynchronize = mode === 'create' ? true : false;
  const isDropSchema = mode === 'create' ? true : false;

  let conn;
  try {
    conn = await typeorm.getConnection(environment, mysql, isSynchronize, isDropSchema);
    // step1 - 노선과, 노선별 역 데이터 insert
    if (mode === 'create') {
      await step1InsertMetro(conn, api, openApi);
    }

    // stop2 - 역별 시간표 insert
    if (mode === 'create' || mode === 'update') {
      await step2InsertTimetable(conn, api, openApi);
    }
  } catch (error) {
    console.error(error);
  } finally {
    conn?.close();
  }
})();
