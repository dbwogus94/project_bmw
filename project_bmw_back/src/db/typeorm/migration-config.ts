import { getTypeOrmConfig } from '@db/database';
import dotenv from 'dotenv';
import { join } from 'path';
// TODO: production || development 를 외부에서 주입하여 실행하도록 설정해야함
dotenv.config({ path: join(process.cwd(), 'env/production.env') });

export = (async () => {
  const { config } = await import('@config');
  const { environment, mysql } = config;
  return getTypeOrmConfig(environment, mysql);
})();
