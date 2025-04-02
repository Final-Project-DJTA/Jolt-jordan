import { database } from "../config/mongodb"

class JobModel {
    static collection() {
        return database.collection('jobs')
    }

    static async getAll() {
        const jobs = await this.collection().find().toArray()

        return jobs.map((job) => ({
            ...job,
            _id: job._id.toString()
        }))
    }
    static async findBySlug(slug: string) {
        const job = await this.collection().findOne({ slug });
        if (!job) return null;
        return { ...job, _id: job._id.toString() }; 
    }
    static async searchByName(name: string) {
        const regex = new RegExp(name, "i"); 
        const jobs = await this.collection().find({ name: { $regex: regex } }).limit(3).toArray();
        return jobs.map((product) => ({
          ...product,
          _id: product._id.toString(),
        }));
    } 
}

export default JobModel
