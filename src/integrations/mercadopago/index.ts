import axios, { AxiosError, AxiosInstance } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

import { PaymentGateway } from '../../gateway';
import { Currency } from '../../types';
import AppError from '../../utils/error';
import { Config } from './api';
import { PaymentPayload } from './types';

export class MercadoPagoPaymentGateway extends PaymentGateway<Config> {
  readonly name = 'mercadopago';
  readonly baseUrl = 'https://api.mercadopago.com';
  protected config: Config;
  readonly acceptedCurrencies = [Currency.UYU];
  private axiosInstance: AxiosInstance;

  initialize(): void {
    if (this.initialized) throw new AppError('Payment gateway already initialized.', 400);
    const basicClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    });

    this.axiosInstance = applyCaseMiddleware(basicClient, {
      ignoreHeaders: true,
    });

    this.initialized = true;
  }

  async processPayment(payload: PaymentPayload): Promise<string> {
    const { transaction_amount, description, payment_method_id, payer, token, installments } = payload;
    try {
      const { data } = await this.axiosInstance.post('/v1/payments', {
        transaction_amount,
        description,
        payment_method_id,
        payer,
        token,
        installments: installments || 1,
      });

      return data.id;
    } catch (e: any) {
      const { response } = e as AxiosError;
      const { status, data } = response;
      throw new AppError((data as Record<string, unknown>).message as string, status);
    }

    return Promise.resolve('');
  }

  getPaymentStatus(paymentId: string): Promise<string> {
    return Promise.resolve(paymentId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refundPayment(paymentId: string, amount: number, currency: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
