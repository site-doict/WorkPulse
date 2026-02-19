import { supabase } from "./auth.js";

export async function loadAttendance() {
  const userId = localStorage.getItem("userId");

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(7);

  if (!error) {
    console.log(data);
  }
}

export async function markIn() {
  const userId = localStorage.getItem("userId");
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  await supabase.from("attendance").insert([
    {
      userId: userId,
      date: date,
      in_time: now.toISOString(),
      status: "Present"
    }
  ]);
}

export async function markOut() {
  const userId = localStorage.getItem("userId");
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  await supabase
    .from("attendance")
    .update({ out_time: now.toISOString() })
    .eq("userId", userId)
    .eq("date", date);
}
