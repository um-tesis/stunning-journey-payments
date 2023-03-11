import { PaymentGateway } from '../gateway';
import { MercadoPagoPaymentGateway } from './mercadopago';

export const paymentGateways: Record<string, string> = {
  mercadopago: MercadoPagoPaymentGateway.name,
};

let gatewayInstance: PaymentGateway;

export const getPaymentGateway = (gateway: string): PaymentGateway => {
  if (gatewayInstance && gatewayInstance.name === gateway) return gatewayInstance;

  switch (gateway) {
    case 'mercadopago':
      gatewayInstance = new MercadoPagoPaymentGateway();
      break;
    default:
      throw new Error('Invalid gateway');
  }

  return gatewayInstance;
};
