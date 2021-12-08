import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { config } from '@config';
import { getConnection } from '@db/database';
// Start the server
const port = Number(config.server.port || 3000);

getConnection()
  .then(connection => {
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port);
    });
  })
  .catch(console.error);
