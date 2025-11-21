import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server only

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, guests, message, dietary, needRide, bringingDish } =
      body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and contact are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("rsvps").insert({
      name,
      email,
      guests: guests ?? 1,
      message: message ?? "",
      dietary: dietary ?? "",
      need_ride: !!needRide,
      bringing_dish: !!bringingDish,
      source: "thanksgiving_feast", // optional: helps you filter later
    });

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json(
        { error: "Failed to save RSVP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("RSVP handler error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
