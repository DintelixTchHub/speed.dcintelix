import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(parseInt(searchParams.get("days") || "7", 10) || 7, 1), 90);

  const dailyTests: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dailyTests.push({
      date: date.toISOString().split("T")[0],
      count: 0,
    });
  }

  return NextResponse.json(dailyTests);
}
