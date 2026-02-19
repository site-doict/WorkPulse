// js/config.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://nciahmkjmpowidzauzam.supabase.co";

export const SUPABASE_ANON_KEY = "sb_publishable_tnDIISrYfxJxvGUGhPm9CQ_sg3hyBb5";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
