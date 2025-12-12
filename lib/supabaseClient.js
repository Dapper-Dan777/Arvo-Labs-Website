import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cywpgkrahaioosmewpms.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3Bna3JhaGFpb29zbWV3cG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODg2NjQsImV4cCI6MjA4MDg2NDY2NH0.YWUWY86NrbfKt88oc4G1fsQvNdbocaQGKCPbr9cycHc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


