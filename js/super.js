import { supabase } from "./auth.js";

export async function loadAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  console.log("All Users:", data);
}
