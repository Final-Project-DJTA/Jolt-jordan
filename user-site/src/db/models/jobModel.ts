import { database } from "../config/mongodb"
import { ObjectId } from "mongodb"
import { UserType } from "@/types"

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
        const jobs = await this.collection().find({
            $or: [
             {name: { $regex: regex }},
             {'company.name': {$regex: regex}}
            ]
        }).limit(3).toArray();

        return jobs.map((job) => ({
          ...job,
          _id: job._id.toString(),
        }));
    }

    static async filterByCategory(category: string){
        const jobs = await this.collection().find({category}).toArray()
        return jobs.map((job) => ({
            ...job,
            _id: job._id.toString()
        }))
    }

    static async filterBySalary(salary: string){
        const jobs = await this.collection().find({ salary }).toArray()
        return jobs.map((job) => ({
            ...job,
            _id: job._id.toString()
        }))
    }

    static async filterByLocation(location: string){
        const jobs = await this.collection().find({ location }).toArray()
        return jobs.map((job) => ({
            ...job,
            _id: job._id.toString()
        }))
    }

    static async filterJobs({category, location, salary}: { //ini kl buat filter all yg pake select box itu
        category ?: string;
        location ?: string;
        salary ?: string
    }){
        const query: any = {}
        if(category) query.category = category
        if(location) query.location = location
        if(salary) query.salary = salary

        const jobs = await this.collection().find({ location }).toArray()
        return jobs.map((job) => ({
            ...job,
            _id: job._id.toString()
        }))
    }
}

export default JobModel
