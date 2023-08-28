#!/usr/bin/env node

/**
 * Module dependencies.
 */

import APP from '../app.js';
import http from 'http';

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  const PORT = parseInt(val, 10);

  if (isNaN(PORT)) {
    // named pipe
    return val;
  }

  if (PORT >= 0) {
    // port number
    return PORT;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const BIND = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(BIND + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(BIND + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const ADDR = SERVER.address();
  const BIND = typeof ADDR === 'string'
    ? 'pipe ' + ADDR
    : 'port ' + ADDR.port;
  console.log('Listening on ' + BIND);
}

/**
 * Get port from environment and store in Express.
 */

const PORT = normalizePort(process.env.PORT || '3000');
APP.set('port', PORT);

/**
 * Create HTTP server.
 */

const SERVER = http.createServer(APP);

/**
 * Listen on provided port, on all network interfaces.
 */

SERVER.listen(PORT);
SERVER.on('error', onError);
SERVER.on('listening', onListening);
