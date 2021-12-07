import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { config } from './config';
// Start the server
const port = Number(config.server.port || 3000);
app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});
