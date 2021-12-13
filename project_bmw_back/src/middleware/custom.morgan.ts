import morgan, { StreamOptions } from 'morgan';
import { getHttpLogger } from '@shared/http.logger';
import { config } from '@config';

const httpLogger = getHttpLogger();
const { environment } = config;

// Override the stream method by telling
// Morgan은 console.log 대신 윈스턴 커스텀 로거를 사용한다.
const stream: StreamOptions = {
  write: message => httpLogger.http(message),
};

// Morgan http 로그 스킵 설정.
const skip = () => {
  return environment !== 'development';
};

// Build morgan middleware
const customMorgan = () =>
  morgan(
    environment === 'development' ? 'dev' : 'combined', // 출력 포멧 설정
    {
      // skip, // 로그 스킵 설정
      stream, // 몰간이 사용할 로거 설정
    },
  );

export default customMorgan;
