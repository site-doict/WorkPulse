import { supabase } from "./auth.js";

export async function loadAttendance() {
  const userId = localStorage.getItem("user_id");

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(7);

  if (!error) {
    console.log(data);
  }
}

export async function markIn() {
  const userId = localStorage.getItem("user_id");
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  await supabase.from("attendance").insert([
    {
      user_id: userId,
      date: date,
      in_time: now.toISOString(),
      status: "Present"
    }
  ]);
}

export async function markOut() {
  const userId = localStorage.getItem("user_id");
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  await supabase
    .from("attendance")
    .update({ out_time: now.toISOString() })
    .eq("user_id", userId)
    .eq("date", date);
}
