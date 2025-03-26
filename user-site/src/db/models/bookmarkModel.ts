import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

class BookmarkModel {
    static collection() {
        return database.collection("bookmark");
    }

    static async create(payload: { userId: string, jobId: string }) {
        const existing = await this.collection().findOne({
          userId: new ObjectId(payload.userId),
          jobId: new ObjectId(payload.jobId),
        });
      
        if (existing) throw { message: "You already added this job vacancy to your bookmark", status: 400 };
      
        const newBookmark = {
          userId: new ObjectId(payload.userId),
          jobId: new ObjectId(payload.jobId),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return await this.collection().insertOne(newBookmark);
      }

    static async getAll(userId: string) {
        const jobs = await this.collection().aggregate([
            { $match: { userId: new ObjectId(userId) } },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "job"
                }
            },
            { $unwind: "$job" },
            {
                '$project': {
                    'createdAt': false,
                    'updatedAt': false,
                    'job.createdAt': false,
                    'job.updatedAt': false
                }
            }
        ]).toArray();

        return jobs;
    }
    static async remove(userId: string, jobId: string) {
        return await this.collection().deleteOne({ userId: new ObjectId(userId), jobId: new ObjectId(jobId) });
    }
}

export default BookmarkModel;