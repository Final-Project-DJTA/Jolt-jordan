import BookmarkModel from "@/db/models/bookmarkModel";
import { errHandler } from "@/helpers/errHandler";
import { CustomError } from "@/types";
import { cookies } from "next/headers";
import { verifyWithJose } from "@/helpers/jwt";

export async function GET(req: Request) {
  try {
    const auth = (await cookies()).get("Authorization")?.value;
    if (!auth) return Response.json({ message: "Unauthorized" }, { status: 401 });
    
    const [type, token] = auth.split(" ");
    const decoded = await verifyWithJose<{ _id: string }>(token);
    const userId = decoded._id;
        console.log("🔍 USER ID:", userId); // ← Tambahkan log ini

    const bookmarks = await BookmarkModel.getAll(userId);
    return Response.json(bookmarks);
  } catch (error) {
    return errHandler(error as CustomError);
  }
}

export async function POST(req: Request) {
  try {
    const auth = (await cookies()).get("Authorization")?.value;
    if (!auth) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const [type, token] = auth.split(" ");
    const decoded = await verifyWithJose<{ _id: string }>(token);
    const userId = decoded._id;

    const { jobId } = await req.json();
    if (!jobId) return Response.json({ message: "Job ID required" }, { status: 400 });

    console.log("✅ FINAL USER ID (POST):", userId);

    const res = await BookmarkModel.create({ userId, jobId });
    return Response.json(res);
  } catch (error) {
    return errHandler(error as CustomError);
  }
}


export async function DELETE(req: Request) {
  try {
    const auth = (await cookies()).get("Authorization")?.value;
    if (!auth) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const [type, token] = auth.split(" ");
    const decoded = await verifyWithJose<{ _id: string }>(token);
    const userId = decoded._id;

    const { jobId } = await req.json();
    if (!jobId) return Response.json({ message: "Job ID required" }, { status: 400 });

    console.log("✅ FINAL USER ID (DELETE):", userId);

    const res = await BookmarkModel.remove(userId, jobId);
    return Response.json(res);
  } catch (error) {
    return errHandler(error as CustomError);
  }
}

