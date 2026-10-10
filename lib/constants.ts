export const ZIMBABWE_TRADE_HUBS = [
  'Chiredzi Town',
  'Tshovani Town',
  'Hippo Valley Estate',
  'Triangle Estate',
  'Mkwasine',
  'Buffalo Range',
  'Malipati',
  'Checheche Growth Point',
  'Jerera Growth Point',
  'Gutu Mpandawana',
  'Masvingo CBD',
  'Harare CBD',
  'Harare - Borrowdale',
  'Harare - Avondale',
  'Harare - Mbare / Machipisa',
  'Harare - Eastgate / Sam Levy',
  'Bulawayo CBD',
  'Bulawayo - Hillside',
  'Mutare',
  'Gweru',
  'Kwekwe',
  'Chinhoyi',
  'Bindura',
  'Marondera',
  'Victoria Falls',
  'Beitbridge',
  'Zvishavane',
  'Chipinge',
  'Kariba',
  'Nandi',
] as const;

export const PLATFORM_FEE_PERCENT = 0.05; // 5%
export const MIN_PLATFORM_FEE = 0.50; // $0.50 USD floor
export const MAX_PLATFORM_FEE = 20.00; // $20.00 USD cap

export function calculatePlatformFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  const rawFee = subtotal * PLATFORM_FEE_PERCENT;
  const clampedFee = Math.min(Math.max(rawFee, MIN_PLATFORM_FEE), MAX_PLATFORM_FEE);
  return Number(clampedFee.toFixed(2));
}

export function calculateTotalWithFee(subtotal: number): { subtotal: number; fee: number; total: number } {
  const fee = calculatePlatformFee(subtotal);
  const total = Number((subtotal + fee).toFixed(2));
  return { subtotal, fee, total };
}
