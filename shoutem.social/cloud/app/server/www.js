/* eslint no-console:0 */
import app from './app';
import http from 'http';
import database from '../../src/shared/db/database';
import { logger } from '../../src/shared/logging';

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) return val;
  // port number
  if (port >= 0) return port;

  return false;
}

// Connect to database
database
  .connect()
  .then(() => {
    // Create HTTP server.
    const port = normalizePort(process.env.NODE_PORT || '3000');
    console.log('PORT IS', process.env.NODE_PORT);
    app.set('port', port);
    const server = http.createServer(app);

    server.listen(port);

    // Event listener for HTTP server "error" event.
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;

        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Event listener for HTTP server "listening" event.
    server.on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      logger.info(`Listening on ${bind}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  });
