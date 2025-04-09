import { database } from "@/db/config/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { jobIds } = await req.json();
    
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json({ jobs: [] });
    }
    
    // Convert string IDs to ObjectIds, handling potential invalid IDs
    const objectIds = jobIds
      .filter(id => ObjectId.isValid(id))
      .map(id => new ObjectId(id));
    
    if (objectIds.length === 0) {
      return NextResponse.json({ jobs: [] });
    }
    
    const jobsCollection = database.collection("jobs");
    
    const jobs = await jobsCollection
      .find({ _id: { $in: objectIds } })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch applied jobs" },
      { status: 500 }
    );
  }
}