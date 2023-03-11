import { NextFunction, Request, Response, Router } from 'express';

import { PaymentGateway } from '../gateway';
import { getPaymentGateway, paymentGateways } from '../integrations';
import catchAsync from '../utils/catch-async';
import AppError from '../utils/error';

interface GatewayRequest extends Request {
  gateway?: PaymentGateway;
}

const router = Router();

const getGateway = (req: GatewayRequest, res: Response, next: NextFunction) => {
  const gateway = req.params.gateway;
  if (!gateway || !paymentGateways[gateway]) return next(new AppError('Invalid gateway', 400));

  req.gateway = getPaymentGateway(gateway);

  next();
};

router.use('/gateway/:gateway', getGateway);

router.post('/gateway/:gateway/initialize', (req: GatewayRequest, res: Response, next: NextFunction) => {
  const config = req.body;
  try {
    req.gateway.initialize(config);

    return res.status(200).json({ success: true, message: 'Gateway initialized successfully.' });
  } catch (error: any) {
    return next(new AppError(error.message as string, 500));
  }
});

router.use('/gateway/:gateway', (req: GatewayRequest, res: Response, next: NextFunction) => {
  if (!req.gateway.is()) return next(new AppError('Gateway not initialized', 400));

  next();
});

router.post(
  '/gateway/:gateway/process-payment',
  catchAsync(async (req: GatewayRequest, res) => {
    const paymentId = await req.gateway.processPayment(req.body as Record<string, unknown>);
    return res.status(200).json({ success: true, message: 'Payment processed successfully.', paymentId });
  }),
);

export default router;
