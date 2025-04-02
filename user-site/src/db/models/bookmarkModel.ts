import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

class BookmarkModel {
    static collection() {
        return database.collection("bookmark");
    }

    static async create(payload: { userId: string, jobId: string }) {
        const userId =  new ObjectId(payload.userId)
        const jobId = new ObjectId(payload.jobId)
        
        const existing = await this.collection().findOne({userId, jobId});
      
        // if (existing) throw { message: "You already added this job vacancy to your bookmark", status: 400 };
        
        if(existing){
            await this.collection().updateOne(
                {userId, jobId},
                {
                    $set: {
                        status: "none",
                        updatedAt: new Date()
                    }
                }
            )
            return {message: "Bookmark status reset to 'none'"}
        }

        const newBookmark = {
          userId,
          jobId,
          status: "none" as BookmarkStatus,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await this.collection().insertOne(newBookmark);
        return {message: "Bookmark added successfully"}
    }

    static async getAll(userId: string, status ?: BookmarkStatus) {
        const match: any = {userId: new ObjectId(userId)}
        if(status) match.status = status

        const bookmarks = await this.collection().aggregate([
            { $match: match },
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

        return bookmarks;
    }
    
    static async updateStatus(userId: string, jobId: string, status: BookmarkStatus){
        const userId = new ObjectId(userId)
        const jobId = new ObjectId(jobId)

        const res = await this.collection().updateOne(
            {userId, jobId},
            { $set: {
                status,
                updatedAt: new Date()
            }}
        )

        if(res.matchedCount === 0){
            await this.collection().insertOne({
                userId, jobId, status,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            return { message: `Bookmark status updated to '${status}'` }
        }
    }
}

export default BookmarkModel;
