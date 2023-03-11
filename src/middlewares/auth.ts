import { NextFunction, Request, Response } from 'express';

import AppError from '../utils/error';

// TODO: Store valid API keys in a vault
const validAPIKeys: string[] = [
  '0E8C8EA1EDF44345853B4642534C38A2',
  '89FF23FB573D4692B925D8E4C2CC124E',
  'C5864F58C50848399AFE7BC282C8B82D',
];
const API_KEY_LENGTH = 32;

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey: string = (req.headers['x-api-key'] as string) || (req.query.api_key as string);

  if (!apiKey || !validAPIKeys.includes(apiKey)) return next(new AppError('Unauthorized', 401));

  next();
};

// TODO: Define how we will create API keys
export const generateApiKey = () => crypto.randomUUID().replace(/-/g, '').slice(0, API_KEY_LENGTH);
