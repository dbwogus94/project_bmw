import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Seoul');

export default function (format?: string | undefined, date?: Date | undefined): string {
  if (format && !date) {
    return moment().format(format);
  }
  if (!format && date) {
    return moment().format();
  }
  if (format && date) {
    return moment(date).format(format);
  }

  // 모두 없는 경우
  return moment().format('YYYY-MM-DD HH:mm:ss');
}
