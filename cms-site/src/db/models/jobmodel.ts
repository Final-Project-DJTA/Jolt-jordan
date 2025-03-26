import { database } from "../config/mongodb";

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


}

export default JobModel