import schedule from 'node-schedule';
import { getOpenApi } from '@shared/open-api';
import { DateUtil } from '@shared/util';
import { config } from '@config';
import { getLogger } from '@shared/Logger';
const { dateToString } = DateUtil;

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

let holiday: boolean;
const logger = getLogger();

/**
 * 매일 1시 정각 오늘이 휴일인지 아닌지 체크한다.
 */
export async function setHolidayJob() {
  const { host, key } = config.openApi.holiday;
  const date: string = dateToString('YYYY-MM');
  const [year, month] = date.split('-');
  const query = `solYear=${year}&solMonth=${month}&ServiceKey=${key}`;
  const url = `${host}?${query}`;

  if (holiday == null) {
    try {
      holiday = await getHoliday(url);
    } catch (error) {
      logger.error(`[setHolidayJob] ${error}`);
    }
  }

  schedule.scheduleJob('0 0 1 * * *', async () => {
    try {
      holiday = await getHoliday(url);
    } catch (error) {
      logger.error(`[setHolidayJob] ${error}`);
    }
  });

  async function getHoliday(url: string): Promise<boolean> {
    const data = await getOpenApi().callApi(url, false);
    const { item } = data.response.body.items;
    const toDay = dateToString('YYYYMMDD');
    return !!item.find((obj: any) => String(obj.locdate) === toDay);
  }
}

/**
 * 휴일인지 아닌지 여부를 리턴한다.
 * @returns
 */
export function isHoliday() {
  return holiday;
}
