import { SectorCategory, VisionAnalysisResult } from './types';

export async function analyzeItemPhoto(base64OrUrl: string, fileName?: string): Promise<VisionAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && base64OrUrl) {
    try {
      const isDataUrl = base64OrUrl.startsWith('data:');
      const cleanBase64 = isDataUrl && base64OrUrl.includes('base64,')
        ? base64OrUrl.split('base64,')[1]
        : base64OrUrl;
      const mimeType = isDataUrl
        ? base64OrUrl.split(';')[0].replace('data:', '')
        : 'image/jpeg';

      const parts: any[] = [];

      // Add image data if it's base64
      if (cleanBase64 && cleanBase64.length > 50 && !cleanBase64.startsWith('http')) {
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: `You are an expert Zimbabwean marketplace product classifier for ChiredziTrade in the Lowveld region.
Analyze this photo carefully. Identify specifically what item, agricultural produce, livestock, clothing/textile, grocery wholesale product, construction material, or industrial trade service is shown.
Respond strictly in valid JSON format:
{
  "isValidItem": true,
  "rejectionReason": null,
  "suggestedTitle": "Specific product title (e.g. Green Maize Crop Harvest, Cotton Fabric Dresses, 50kg Mealie Meal Bags, River Sand Haulage)",
  "category": "livestock_agric" | "grocery_wholesale" | "clothing_textiles" | "building_construction" | "industrial_services" | "transport_logistics" | "general_services",
  "tags": ["3 to 5 lowercase keyword tags accurately matching what is visually seen"],
  "conditionGrade": "New" | "Used - Good" | "Used - Fair" | "Service Showcase",
  "confidence": 0.95
}`,
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textPart = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          const parsed = JSON.parse(textPart);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Gemini live API call failed, falling back to smart heuristic:', e);
    }
  }

  // Smart heuristic fallback based on filename and context
  const nameLower = (fileName || '').toLowerCase();
  
  if (nameLower.includes('cow') || nameLower.includes('heifer') || nameLower.includes('cattle') || nameLower.includes('goat') || nameLower.includes('livestock')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: nameLower.includes('goat') ? 'Hardy Boer / Matabele Cross Breeding Goats' : 'Drought-Hardy Brahman Cross Cattle',
      category: 'livestock_agric',
      tags: ['livestock', 'cattle', 'pasture', 'chiredzi', 'farming'],
      conditionGrade: 'New',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('crop') || nameLower.includes('farm') || nameLower.includes('tractor') || nameLower.includes('maize') || nameLower.includes('cane') || nameLower.includes('field') || nameLower.includes('harvest')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: nameLower.includes('tractor') ? 'Farm Tractor & Field Machinery' : 'Fresh Harvest Farm Produce',
      category: 'livestock_agric',
      tags: ['farming', 'harvest', 'agriculture', 'crops', 'produce'],
      conditionGrade: 'New',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('dress') || nameLower.includes('cloth') || nameLower.includes('textile') || nameLower.includes('suit') || nameLower.includes('shirt') || nameLower.includes('boutique') || nameLower.includes('tailor')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: 'Custom African Attire & Tailoring (Vasoni veHembe)',
      category: 'clothing_textiles',
      tags: ['clothing', 'boutique', 'tailoring', 'fashion', 'textiles'],
      conditionGrade: 'New',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('grocery') || nameLower.includes('oil') || nameLower.includes('sugar') || nameLower.includes('rice') || nameLower.includes('food') || nameLower.includes('meal')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: 'Wholesale Groceries & Food Commodities',
      category: 'grocery_wholesale',
      tags: ['groceries', 'wholesale', 'food', 'tuckshop', 'bulk supply'],
      conditionGrade: 'New',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('cement') || nameLower.includes('brick') || nameLower.includes('build') || nameLower.includes('sand') || nameLower.includes('hardware') || nameLower.includes('roof')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: 'Building Materials & Hardware Supplies',
      category: 'building_construction',
      tags: ['building', 'construction', 'hardware', 'cement', 'materials'],
      conditionGrade: 'New',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('weld') || nameLower.includes('gate') || nameLower.includes('trailer') || nameLower.includes('pump') || nameLower.includes('metal')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: 'Steel Fabrication & Welding Service',
      category: 'industrial_services',
      tags: ['welding', 'fabrication', 'metalwork', 'industrial', 'repair'],
      conditionGrade: 'Service Showcase',
      confidence: 0.90,
    };
  }

  if (nameLower.includes('truck') || nameLower.includes('haulage') || nameLower.includes('transport') || nameLower.includes('bakkie')) {
    return {
      isValidItem: true,
      rejectionReason: null,
      suggestedTitle: 'Transport & Haulage Logistics',
      category: 'transport_logistics',
      tags: ['transport', 'haulage', 'truck', 'deliveries', 'logistics'],
      conditionGrade: 'Service Showcase',
      confidence: 0.90,
    };
  }

  // Clean generic default without forcing fake tags
  return {
    isValidItem: true,
    rejectionReason: null,
    suggestedTitle: '',
    category: 'livestock_agric',
    tags: [],
    conditionGrade: 'New',
    confidence: 0.85,
  };
}

export function autoClassifyTextCategory(text: string): SectorCategory {
  const lower = (text || '').toLowerCase();

  if (
    lower.includes('cow') || lower.includes('heifer') || lower.includes('bull') || 
    lower.includes('cattle') || lower.includes('mombe') || lower.includes('goat') || 
    lower.includes('mbudzi') || lower.includes('maize') || lower.includes('chibage') || 
    lower.includes('cane') || lower.includes('nzimbe') || lower.includes('vegetable') || 
    lower.includes('crop') || lower.includes('livestock') || lower.includes('farm')
  ) {
    return 'livestock_agric';
  }

  if (
    lower.includes('grocery') || lower.includes('sugar') || lower.includes('oil') || 
    lower.includes('rice') || lower.includes('flour') || lower.includes('meal') || 
    lower.includes('upfu') || lower.includes('food') || lower.includes('tuckshop') || 
    lower.includes('wholesale')
  ) {
    return 'grocery_wholesale';
  }

  if (
    lower.includes('cloth') || lower.includes('dress') || lower.includes('shirt') || 
    lower.includes('suit') || lower.includes('hembe') || lower.includes('mbatya') || 
    lower.includes('vasoni') || lower.includes('boutique') || lower.includes('tailor') || 
    lower.includes('fabric') || lower.includes('sewing')
  ) {
    return 'clothing_textiles';
  }

  if (
    lower.includes('cement') || lower.includes('simende') || lower.includes('brick') || 
    lower.includes('sand') || lower.includes('timber') || lower.includes('puranga') || 
    lower.includes('kuvaka') || lower.includes('build') || lower.includes('hardware') || 
    lower.includes('roof') || lower.includes('paint')
  ) {
    return 'building_construction';
  }

  if (
    lower.includes('weld') || lower.includes('gate') || lower.includes('trailer') || 
    lower.includes('pump') || lower.includes('borehole') || lower.includes('metal') || 
    lower.includes('iron') || lower.includes('engine') || lower.includes('mechanic')
  ) {
    return 'industrial_services';
  }

  if (
    lower.includes('truck') || lower.includes('haulage') || lower.includes('transport') || 
    lower.includes('lorry') || lower.includes('rhori') || lower.includes('bakkie') || 
    lower.includes('deliver') || lower.includes('pickup') || lower.includes('hire')
  ) {
    return 'transport_logistics';
  }

  return 'general_services';
}
