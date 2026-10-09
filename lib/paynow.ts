import crypto from 'crypto';

/**
 * PAYNOW ZIMBABWE PAYMENT INTEGRATION ENGINE
 * Supports: EcoCash, OneMoney, Visa/Mastercard, Zimswitch V-Payment.
 * Docs: https://www.paynow.co.zw/KnowledgeBase/Index
 */

export interface PaynowInitiateParams {
  reference: string;
  amount: number;
  additionalInfo?: string;
  returnUrl: string;
  resultUrl: string;
  authEmail?: string;
  authPhone?: string;
}

export interface PaynowInitiateResult {
  success: boolean;
  redirectUrl?: string;
  pollUrl?: string;
  reference?: string;
  error?: string;
  isSimulated?: boolean;
}

const INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID || '';
const INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY || '';

/**
 * Generates Paynow SHA512 hash from message values + integration key
 */
function generatePaynowHash(values: Record<string, string>, integrationKey: string): string {
  let stringToHash = '';
  Object.keys(values).forEach((key) => {
    if (key.toLowerCase() !== 'hash') {
      stringToHash += values[key];
    }
  });
  stringToHash += integrationKey;

  return crypto.createHash('sha512').update(stringToHash, 'utf8').digest('hex').toUpperCase();
}

/**
 * Initiates a payment session with Paynow Zimbabwe.
 * Falls back to an interactive sandbox / demo payment session if API keys are not yet configured.
 */
export async function initiatePaynowPayment(params: PaynowInitiateParams): Promise<PaynowInitiateResult> {
  const { reference, amount, additionalInfo, returnUrl, resultUrl, authEmail, authPhone } = params;

  // If live Paynow credentials are configured in environment variables
  if (INTEGRATION_ID && INTEGRATION_KEY) {
    try {
      const payload: Record<string, string> = {
        resulturl: resultUrl,
        returnurl: returnUrl,
        reference: reference,
        amount: amount.toFixed(2),
        id: INTEGRATION_ID,
        additionalinfo: additionalInfo || 'ZimBarter Marketplace Order',
        status: 'Message',
      };

      if (authEmail) payload.authemail = authEmail;

      const hash = generatePaynowHash(payload, INTEGRATION_KEY);
      payload.hash = hash;

      const body = new URLSearchParams(payload).toString();

      const response = await fetch('https://www.paynow.co.zw/interface/initiatetransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      const responseText = await response.text();
      const params = new URLSearchParams(responseText);
      const status = params.get('status')?.toLowerCase();

      if (status === 'ok') {
        const browserUrl = params.get('browserurl') || '';
        const pollUrl = params.get('pollurl') || '';
        return {
          success: true,
          redirectUrl: browserUrl,
          pollUrl,
          reference,
          isSimulated: false,
        };
      } else {
        const errorMsg = params.get('error') || 'Paynow returned an error';
        console.warn('Paynow API error:', errorMsg);
        return {
          success: false,
          error: errorMsg,
        };
      }
    } catch (err: any) {
      console.error('Paynow initiation network error:', err);
      return {
        success: false,
        error: err.message || 'Payment gateway connection failed',
      };
    }
  }

  // Seamless Sandbox / Instant Simulated Checkout for development & immediate user testing
  const simulatedRedirectUrl = `${returnUrl}?paynow_ref=${encodeURIComponent(reference)}&status=simulated_paid`;
  return {
    success: true,
    redirectUrl: simulatedRedirectUrl,
    pollUrl: '',
    reference,
    isSimulated: true,
  };
}
