
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kwkbscdtihscaephmqtp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a2JzY2R0aWhzY2FlcGhtcXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTUwNDksImV4cCI6MjA1ODY3MTA0OX0.jd9dzWgBrnPiFMxt0TmLcvU0KURzYKRgqHxgKOwJvWI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
