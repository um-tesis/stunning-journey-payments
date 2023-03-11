export type PaymentPayload = {
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  installments: number;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: IdentificationType;
      number: string;
    };
  };
  token: string;
  metadata?: Record<string, any>;
};

enum IdentificationType {
  DNI = 'DNI',
  CUIT = 'CUIT',
  CUIL = 'CUIL',
  CI = 'CI',
}
