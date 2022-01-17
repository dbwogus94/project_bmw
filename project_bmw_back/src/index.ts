import './pre-start'; // Must be the first import
import { config } from '@config';
import app from '@server';
import { getLogger } from '@shared/Logger';
import * as typeorm from '@db/database';
import * as redis from '@db/redis';
// Create server
const port = Number(config.server.port || 3000);
const logger = getLogger();
const { environment, mysql } = config;

typeorm // mysql(typeOrm)
  .getConnection(environment, mysql, false, false)
  .then(redis.createConnection)
  .then(() => {
    // Start server
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port);
    });
  })
  .catch(logger.error);
