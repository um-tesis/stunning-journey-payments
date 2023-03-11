import { Currency } from './types';

export abstract class PaymentGateway<Config = any> {
  // The name of the payment gateway.
  readonly name: string;

  // The base URL of the payment gateway API.
  readonly baseUrl: string;

  // Any necessary configuration for the payment gateway.
  protected config: Config;

  // The currencies accepted by the payment gateway.
  readonly acceptedCurrencies: Currency[];

  // Whether the payment gateway is initialized.
  protected initialized = false;

  // Initializes the payment gateway with any necessary configuration.
  abstract initialize(config: Config): void;

  // Processes a payment with the given amount and currency.
  abstract processPayment(payload: Record<string, unknown>): Promise<string>;

  // Retrieves the status of a previously processed payment.
  abstract getPaymentStatus(paymentId: string): Promise<string>;

  // Refunds a previously processed payment with the given amount and currency.
  abstract refundPayment(paymentId: string, amount: number, currency: string): Promise<boolean>;

  // Checks whether the payment gateway is initialized.
  is(): boolean {
    return this.initialized;
  }
}
