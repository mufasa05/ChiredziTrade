import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase client failed to initialize in storage service:', e);
  }
}

/**
 * Uploads a base64 image or File object to Supabase Storage bucket ('listing-images').
 * Returns the public CDN URL if upload succeeds, or falls back to the compressed base64 data string.
 */
export async function uploadListingImage(
  base64OrFile: string,
  fileName?: string
): Promise<string> {
  // If Supabase client is not available or input is an external URL, return as is
  if (!supabase || base64OrFile.startsWith('http://') || base64OrFile.startsWith('https://')) {
    return base64OrFile;
  }

  try {
    const isDataUrl = base64OrFile.startsWith('data:');
    if (!isDataUrl) return base64OrFile;

    const mimeMatch = base64OrFile.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = mimeType.split('/')[1] || 'jpeg';

    const base64Data = base64OrFile.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFileName = `listing_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `public/${cleanFileName}`;

    // Upload buffer to Supabase Storage 'listing-images' bucket
    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(filePath, buffer, {
        contentType: mimeType,
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage bucket upload warning, using compressed fallback:', error.message);
      return base64OrFile;
    }

    // Get Public CDN URL
    const { data: publicUrlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl;
    }
  } catch (err) {
    console.error('Failed to upload image to Supabase Storage, using fallback:', err);
  }

  return base64OrFile;
}
