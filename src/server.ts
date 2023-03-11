import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config();

import app from './app';

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.info(`🚀💸 listening on port ${port}...`);
});

/* eslint-disable */
process.on('unhandledRejection', (err: Error) => {
  // Unhandled promise rejections
  // @ts-ignore
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
/* eslint-enable */

process.on('SIGTERM', () => {
  console.error('SIGTERM received, shutting down the server...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
