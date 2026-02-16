import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { error };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", data.user.id)
    .single();

  localStorage.setItem("user_id", data.user.id);
  localStorage.setItem("role", profile.role);

  return { role: profile.role };
}

export async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "login.html";
  }
}

export async function logoutUser() {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "login.html";
}
