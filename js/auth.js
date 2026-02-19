// js/auth.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Login function
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return { error };

  // fetch user profile for role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", data.user.id)
    .single();

  if (profileError) return { error: profileError };

  // store minimal info in localStorage if needed
  localStorage.setItem("user_id", data.user.id);
  localStorage.setItem("role", profile.role);

  return { role: profile.role, userId: data.user.id };
}

// Check session function
export async function checkSession() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return null;
  }

  return data.user; // { id, email, etc. }
}

// Logout
export async function logoutUser() {
  await supabase.auth.signOut();
  localStorage.clear();
  window.location.href = "login.html";
}
