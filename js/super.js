// js/super.js
import { supabase } from "./config.js";

export async function loadAllUsers() {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) { console.error("loadAllUsers error:", error); return []; }
  return data;
}
