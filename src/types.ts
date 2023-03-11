import { Config as MercadoPagoConfig } from './integrations/mercadopago/api';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UYU = 'UYU',
  ARS = 'ARS',
}

interface ConfigMap {
  mercadopago: MercadoPagoConfig;
}

export type Config = Partial<ConfigMap>;
