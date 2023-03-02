import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import xss from 'xss-clean';

import { apiKeyAuth } from './middlewares';
import paymentRouter from './routes';

const app = express();

// Middlewares
// Implement CORS, only works on GET and POST requests (simple requests)
app.use(cors());

// To fix the previous error, and allow PUT, PATCH adn DELETE requests to be cross-origin we need to make an options request and implement cors as a middleware
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.options('*', cors());

// Security HTTP Headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request for this IP, please try again in a hour!',
});

app.use('/api', limiter); // Limit only API routes

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against XSS (Cross Site Scripting)
app.use(xss());

// Routes
app.use(apiKeyAuth);
app.get('/health', (_, res) => res.status(200).send({ success: true }));
app.use('/api/v1', paymentRouter);

// All non-specified routes return 404
app.get('*', (_, res) => res.status(404).send('Not Found'));

const server = http.createServer(app);

server.on('listening', () => {
  console.info(`🚀💸 listening on port ${process.env.PORT}...`);
});

export default app;
