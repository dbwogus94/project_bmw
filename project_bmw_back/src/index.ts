import './pre-start'; // Rede Env file
import { config } from '@config'; // Create config
import app from '@server'; // Create express
import { getLogger } from '@shared/Logger'; // Create winston
import * as typeorm from '@db/database';
import * as redis from '@db/redis';
import * as scheduler from '@shared/scheduler';

const port = Number(config.server.port || 3000);
const logger = getLogger();
const { environment, mysql } = config;

typeorm // mysql(typeOrm)
  .getConnection(environment, mysql, false, false)
  .then(redis.createConnection)
  .then(() => {
    // Start server
    app.listen(port, () => {
      scheduler.initJob();
      logger.info('Express server started on port: ' + port);
    });
  })
  .catch(logger.error);
