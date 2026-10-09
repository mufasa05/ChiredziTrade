/**
 * Centralized Supabase Configuration & Fallback Sanitizer.
 * Guarantees that the app always connects to the active Supabase project
 * https://cyypscxgoyrhyhfohkub.supabase.co even if Vercel has cached legacy env vars.
 */

const RAW_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const RAW_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const SUPABASE_URL =
  RAW_URL && !RAW_URL.includes('kuevrcdsqxujcgdwwpup')
    ? RAW_URL
    : 'https://cyypscxgoyrhyhfohkub.supabase.co';

export const SUPABASE_ANON_KEY =
  RAW_KEY && RAW_KEY.length > 20
    ? RAW_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eXBzY3hnb3lyaHloZm9oa3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTcxMzUsImV4cCI6MjEwNzAzMzEzNX0.RD7tyVRzMMhXulVXrID5DaMp6EvEro-nLc-NIo40Jls';
