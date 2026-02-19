// js/dashboard.js
import { supabase } from "./auth.js";

// Load last 7 attendance entries
export async function loadAttendance(userId) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(7);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Attendance:", data);
}

// Mark In (prevent multiple in same day)
export async function markIn(userId) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  // Check if already marked in today
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (existing) {
    alert("Already marked In for today");
    return;
  }

  await supabase.from("attendance").insert([
    {
      user_id: userId,
      date: date,
      in_time: now.toISOString(),
      status: "Present"
    }
  ]);

  alert("Marked In successfully");
}

// Mark Out
export async function markOut(userId) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (!existing) {
    alert("You must Mark In first!");
    return;
  }

  if (existing.out_time) {
    alert("Already marked Out for today");
    return;
  }

  await supabase
    .from("attendance")
    .update({ out_time: now.toISOString() })
    .eq("user_id", userId)
    .eq("date", date);

  alert("Marked Out successfully");
}
