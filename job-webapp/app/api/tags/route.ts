import { database } from "@/db/config/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobsCollection = database.collection("jobs");
    
    // Use MongoDB aggregation to get all unique tags from jobs
    const uniqueTags = await jobsCollection.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $project: { _id: 0, name: "$_id" } },
      { $sort: { name: 1 } }
    ]).toArray();

    return NextResponse.json({ tags: uniqueTags.map(tag => tag.name) }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}