import dotenv from 'dotenv';

import app from './server';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.info(`🚀💸 listening on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
  // Unhandled promise rejections
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.error('SIGTERM received, shutting down the server...');
  server.close(() => {
    console.log('Process terminated!');
  });
});
