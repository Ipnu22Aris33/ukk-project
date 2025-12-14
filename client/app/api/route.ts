import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/server/helpers/supabaseClient";

// GET → fetch semua profiles
export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

// POST → create profile baru (hanya name)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string = body.name;

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("profiles").insert({ name }).select();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
