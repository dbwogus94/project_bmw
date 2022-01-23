// Must be the first import
import '../index';
import { config } from '@config';
import * as typeorm from '@db/database';
import step1InsertMetro from './step1-insert-metro';
import step2InsertTimetable from './step2-insert-timetable';
import { XMLParser } from 'fast-xml-parser';
import { OpenApi } from '@shared/open-api';

(async () => {
  const { openApi } = config;
  const { environment, mysql } = config;
  const api = new OpenApi(new XMLParser());

  let conn;
  try {
    conn = await typeorm.getConnection(environment, mysql, false, false);
    // step1 - 노선과, 노선별 역 데이터 insert
    await step1InsertMetro(conn, api, openApi);
    // stop2 - 역별 시간표 insert
    await step2InsertTimetable(conn, api, openApi);
  } catch (error) {
    console.error(error);
  } finally {
    conn?.close();
  }
})();
