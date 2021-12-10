// import 'module-alias/register';
import './pre-start'; // Must be the first import
import app from '@src/Server';
import logger from '@src/shared/Logger';
import { config } from '@src/config';
import { getConnection } from '@src/db/database';
import { createConnection } from '@src/db/redis';
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
