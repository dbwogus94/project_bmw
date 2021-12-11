import { config } from '@config';
import { getLogger } from '@shared/logger';
import { createClient } from 'redis';

let client: any = null;

export async function createConnection(): Promise<void> {
  if (!client) {
    const logger = getLogger();
    const { name, url, password } = config.redis;
    client = createClient({
      // redis[s]://[[username][:password]@][host][:port][/db-number]:
      // redis://alice:foobared@awesome.redis.server:6380
      //url: `redis://${name}:${password}@${url}`,
      url,
      password,
    });
    // redis 연결 끊어지면 발생하는 이벤트
    client.on('error', (err: Error) => {
      err.message = '[redis] ' + err.message;
      logger.error(err);
      // TODO: 에러 처리
      // client.disconnect();
      return;
    });
    // 연결
    await client.connect();
  }
}

export function getClient() {
  if (!client) {
    throw new Error('client init error - first call createConnection');
  }
  return client;
}
