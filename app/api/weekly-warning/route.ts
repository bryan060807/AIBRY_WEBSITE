import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Explicitly typed environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define what an expense entry looks like
type Expense = {
  id: string;
  guilt: number;
  created_at: string;
  [key: string]: any;
};

// GET /api/weekly-warning
export async function GET() {
  try {
    // 🕓 One week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 📊 Fetch all expenses from last 7 days
    const { data, error } = await supabase
      .from("expenses")
      .select("id, guilt, created_at")
      .gte("created_at", oneWeekAgo.toISOString());

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: `Supabase error: ${error.message}` },
        { status: 500 }
      );
    }

    // ✅ Type-safe reduce
    const weeklyGuilt = (data ?? []).reduce(
      (sum: number, e: Expense) => sum + (e.guilt || 0),
      0
    );

    // ⚙️ Threshold for triggering the warning
    const guiltThreshold = 20;

    let warning: string | null = null;
    if (weeklyGuilt >= guiltThreshold) {
      warning = `🚨 Guilt threshold exceeded! Weekly guilt score is ${weeklyGuilt}.`;
    }

    return NextResponse.json(
      {
        weeklyGuilt,
        guiltThreshold,
        warning,
        message: warning
          ? "You might want to ease up this week!"
          : "You're doing fine — no guilt detected.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error." },
      { status: 500 }
    );
  }
}
