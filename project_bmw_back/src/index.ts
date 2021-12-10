// import 'module-alias/register';
import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { config } from '@config';
import { getConnection } from '@db/database';
import { createConnection } from '@db/redis';
// Start the server
const port = Number(config.server.port || 3000);

// mysql(typeOrm)
getConnection()
  // redis
  .then(createConnection)
  // express
  .then(() => {
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port);
    });
  })
  .catch(console.error);
