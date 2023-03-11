import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/error';
const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req?.originalUrl?.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
    status: err.statusCode,
  });
};

const sendErrorProd = (err, req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational error, trusted error: send msg to client
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
        status: err.statusCode,
      });
    }
    // Programming and unknown errors: don't leak error details
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later!',
      status: err.statusCode,
    });
  }
  if (err.isOperational) {
    // Operational error, trusted error: send msg to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming and unknown errors: don't leak error details
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    const error = { ...err };
    error.message = err.message;
    sendErrorProd(error, req, res);
  }
};
