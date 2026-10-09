// @ts-ignore
import { Paynow } from 'paynow';

/**
 * PAYNOW ZIMBABWE OFFICIAL PAYMENT ENGINE
 * Supports:
 * 1. EcoCash & OneMoney Mobile Money (USSD push prompt sent directly to buyer's phone)
 * 2. InnBucks, Zimswitch & Visa/Mastercard (Paynow Web Checkout)
 * 3. Fallback Sandbox / Dev Simulator when live keys are unconfigured
 */

export interface PaynowPaymentParams {
  reference: string;
  amount: number;
  title: string;
  authEmail: string;
  phone?: string;
  paymentMethod: 'ecocash' | 'onemoney' | 'paynow_web';
  returnUrl: string;
  resultUrl: string;
}

export interface PaynowPaymentResponse {
  success: boolean;
  status: 'sent_prompt' | 'redirect_ready' | 'simulated_success' | 'failed';
  redirectUrl?: string;
  pollUrl?: string;
  instructions?: string;
  orderReference: string;
  error?: string;
  isSimulated?: boolean;
}

const INTEGRATION_ID = (process.env.PAYNOW_INTEGRATION_ID || '').trim();
const INTEGRATION_KEY = (process.env.PAYNOW_INTEGRATION_KEY || '').trim();

/**
 * Initiates payment with Paynow Zimbabwe using the official Paynow SDK
 */
export async function initiatePaynowTransaction(params: PaynowPaymentParams): Promise<PaynowPaymentResponse> {
  const {
    reference,
    amount,
    title,
    authEmail,
    phone,
    paymentMethod,
    returnUrl,
    resultUrl,
  } = params;

  const cleanPhone = (phone || '').replace(/[^\d+]/g, '');
  const validEmail = (authEmail && authEmail.includes('@')) 
    ? authEmail 
    : `buyer.${reference.toLowerCase().replace(/[^a-z0-9]/g, '')}@zimbarter.co.zw`;

  // 1. LIVE PRODUCTION MODE (When live Paynow credentials are configured)
  if (INTEGRATION_ID && INTEGRATION_KEY) {
    try {
      const paynow = new Paynow(INTEGRATION_ID, INTEGRATION_KEY, resultUrl, returnUrl);
      const payment = paynow.createPayment(reference, validEmail);
      payment.add(title || 'Marketplace Item', Number(amount.toFixed(2)));

      if (paymentMethod === 'ecocash' || paymentMethod === 'onemoney') {
        // Mobile Money Express Checkout: pushes USSD prompt to buyer's phone
        const normalizedPhone = cleanPhone.startsWith('+263') 
          ? '0' + cleanPhone.slice(4) 
          : cleanPhone.startsWith('263') 
          ? '0' + cleanPhone.slice(3) 
          : cleanPhone;

        const response = await paynow.sendMobile(payment, normalizedPhone, paymentMethod);

        if (response && response.success) {
          return {
            success: true,
            status: 'sent_prompt',
            pollUrl: response.pollUrl,
            instructions: response.instructions || `USSD prompt pushed to ${normalizedPhone}. Check your phone to enter your PIN.`,
            orderReference: reference,
            isSimulated: false,
          };
        } else {
          return {
            success: false,
            status: 'failed',
            error: response?.error || 'Paynow EcoCash prompt failed to initiate',
            orderReference: reference,
          };
        }
      } else {
        // Web Checkout (Cards / Zimswitch / InnBucks)
        const response = await paynow.send(payment);
        if (response && response.success) {
          return {
            success: true,
            status: 'redirect_ready',
            redirectUrl: response.redirectUrl,
            pollUrl: response.pollUrl,
            orderReference: reference,
            isSimulated: false,
          };
        } else {
          return {
            success: false,
            status: 'failed',
            error: response?.error || 'Paynow web checkout failed to initiate',
            orderReference: reference,
          };
        }
      }
    } catch (err: any) {
      console.error('Paynow live API error:', err);
      return {
        success: false,
        status: 'failed',
        error: err.message || 'Payment gateway connection error',
        orderReference: reference,
      };
    }
  }

  // 2. SIMULATED / SANDBOX MODE (For local development or before keys are set)
  if (paymentMethod === 'ecocash' || paymentMethod === 'onemoney') {
    return {
      success: true,
      status: 'sent_prompt',
      instructions: `[SANDBOX] EcoCash USSD prompt simulated for ${cleanPhone || '077...'}. Enter PIN on your phone to complete $${amount.toFixed(2)} payment.`,
      orderReference: reference,
      pollUrl: '',
      isSimulated: true,
    };
  }

  return {
    success: true,
    status: 'redirect_ready',
    redirectUrl: `${returnUrl}?status=simulated_paid&ref=${encodeURIComponent(reference)}`,
    instructions: `[SANDBOX] Paynow Card Checkout session generated.`,
    orderReference: reference,
    pollUrl: '',
    isSimulated: true,
  };
}

/**
 * Polls Paynow transaction status
 */
export async function checkPaynowStatus(pollUrl: string): Promise<{ paid: boolean; status: string }> {
  if (!pollUrl || !INTEGRATION_ID || !INTEGRATION_KEY) {
    return { paid: true, status: 'Paid' };
  }

  try {
    const paynow = new Paynow(INTEGRATION_ID, INTEGRATION_KEY, '', '');
    const status = await paynow.pollTransaction(pollUrl);
    return {
      paid: status && status.paid ? true : false,
      status: status?.status || 'Pending',
    };
  } catch (e) {
    return { paid: false, status: 'Unknown' };
  }
}
