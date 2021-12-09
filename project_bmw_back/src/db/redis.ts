import { config } from '@config';
import { createClient } from 'redis';

let client: any = null;

export async function createConnection(): Promise<void> {
  if (!client) {
    const { name, url, password } = config.redis;
    client = createClient({
      // redis[s]://[[username][:password]@][host][:port][/db-number]:
      // redis://alice:foobared@awesome.redis.server:6380
      //url: `redis://${name}:${password}@${url}`,
      url,
      password,
    });
    // 에러 이벤트 대기
    client.on('error', (err: Error) => console.error('Redis Client Error', err));
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
