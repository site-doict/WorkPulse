import { supabase } from "./config.js";

// Returns attendance array
export async function loadAttendance(userId) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(7);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function markIn(userId) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  // check if already marked
  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (existing) {
    const inTime = new Date(existing.in_time).toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Dhaka" });
    alert(`Already marked In today at ${inTime}`);
    return;
  }

  // insert attendance
  await supabase.from("attendance").insert([
    {
      user_id: userId,
      date: date,
      in_time: now.toISOString(),
      status: "Present"
    }
  ]);

  const localTime = now.toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Dhaka" });
  alert(`Marked In successfully at ${localTime}`);
}

export async function markOut(userId) {
  const now = new Date();
  const date = now.toISOString().split("T")[0];

  // fetch today's attendance
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
    const outTime = new Date(existing.out_time).toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Dhaka" });
    alert(`Already marked Out today at ${outTime}`);
    return;
  }

  // update out_time
  await supabase
    .from("attendance")
    .update({ out_time: now.toISOString() })
    .eq("user_id", userId)
    .eq("date", date);

  const localTime = now.toLocaleTimeString("en-US", { hour12: true, timeZone: "Asia/Dhaka" });
  alert(`Marked Out successfully at ${localTime}`);
}
