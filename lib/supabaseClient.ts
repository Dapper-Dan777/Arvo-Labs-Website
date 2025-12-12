import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cywpgkrahaioosmewpms.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3Bna3JhaGFpb29zbWV3cG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODg2NjQsImV4cCI6MjA4MDg2NDY2NH0.YWUWY86NrbfKt88oc4G1fsQvNdbocaQGKCPbr9cycHc';

// Server-side Supabase Client mit Clerk-Token
export async function getSupabaseClient() {
  const { auth } = await import('@clerk/nextjs/server');
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    },
  });

  return supabase;
}

// Client-side Supabase Client mit Clerk Session Token
export function createSupabaseClientForClient(session: any) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        const token = await session?.getToken({ template: 'supabase' });
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      },
    },
  });
}

// Fallback: Client ohne Auth (für öffentliche Zugriffe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


