import { NextResponse } from "next/server"
import { api } from "@/lib/mongodb/api"

export async function GET() {
  try {
    const stats = await api.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}

