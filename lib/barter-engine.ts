import { Listing, BarterMatch } from './types';
import { db } from './db';

// Computes keyword & semantic overlap between what a listing offers and what other barter listings want
export async function findSmartBarterMatches(targetListing: Listing): Promise<BarterMatch[]> {
  const allListings = await db.getListings();
  const barterListings = allListings.filter(
    (l) => l.id !== targetListing.id && (l.openToBarter || l.currency === 'BARTER')
  );

  const targetOfferTerms = `${targetListing.title} ${targetListing.description} ${(targetListing.imageTags || []).join(' ')}`.toLowerCase();
  const targetWantTerms = (targetListing.barterTerms || '').toLowerCase();

  const matches: BarterMatch[] = [];

  for (const other of barterListings) {
    const otherOfferTerms = `${other.title} ${other.description} ${(other.imageTags || []).join(' ')}`.toLowerCase();
    const otherWantTerms = (other.barterTerms || '').toLowerCase();

    // Calculate cross-fit 1: Does OTHER want what TARGET offers?
    let score1 = calculateFitScore(targetOfferTerms, otherWantTerms);
    // Calculate cross-fit 2: Does TARGET want what OTHER offers?
    let score2 = calculateFitScore(otherOfferTerms, targetWantTerms);

    // If either side has direct keywords or sector synergy
    let totalScore = Math.round(((score1 + score2) / 2) * 100);

    // Baseline synergy boost for real Lowveld barter pairings
    if (
      (targetListing.category === 'livestock_agric' && other.category === 'industrial_services') ||
      (targetListing.category === 'industrial_services' && other.category === 'livestock_agric') ||
      (targetListing.category === 'livestock_agric' && other.category === 'transport_logistics') ||
      (targetListing.category === 'livestock_agric' && other.category === 'grocery_wholesale') ||
      (targetListing.category === 'livestock_agric' && other.category === 'building_construction') ||
      (targetListing.category === 'clothing_textiles' && other.category === 'grocery_wholesale') ||
      (targetListing.category === 'clothing_textiles' && other.category === 'livestock_agric')
    ) {
      totalScore = Math.min(96, Math.max(totalScore, 75));
    }

    if (totalScore >= 50) {
      matches.push({
        matchedListing: other,
        matchScore: totalScore,
        crossFitDescription: `Synergy between ${targetListing.user.fullName}'s (${targetListing.locationArea}) and ${other.user.fullName}'s (${other.locationArea}) offerings.`,
        offerWantedOverlap: other.barterTerms || 'Open for asset exchange',
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
}

function calculateFitScore(offerText: string, wantText: string): number {
  if (!wantText.trim()) return 0.5;

  const wantWords = wantText
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['need', 'seeking', 'want', 'open', 'trade', 'barter', 'will', 'take', 'accept'].includes(w));

  if (wantWords.length === 0) return 0.5;

  let hits = 0;
  for (const word of wantWords) {
    if (offerText.includes(word)) {
      hits++;
    }
  }

  return Math.min(1, 0.4 + (hits / wantWords.length) * 0.6);
}
