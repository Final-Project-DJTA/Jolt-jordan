import { ObjectId } from "mongodb";

export type CustomError = {
    message: string;
    status: number;
}

export type UserType = {
    // _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
}

// export type ProductType = {	
//     _id: string;
//     name: string;
//     slug: string;
//     description: string;
//     excerpt: string;
//     price: number;
//     tags: string[];
//     thumbnail: string;
//     images: string[];
//     createdAt: Date;
//     updatedAt: Date;
// }

export type JobType = {	
    _id: string;
    name: string;
    slug: string;
    location: string;
    category: string;
    salary: string;
    description: string;
    excerpt: string;
    company: company;
    detail: detail;
    createdAt: Date;
    updatedAt: Date;
}

export type company = {
    name:string;
    industry: string;
    size: string;
    website: string;
    headquarters: string;
    logo: string
}

export type detail = {
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
}

export type BookmarkType = {
    _id: string
    userId: string | ObjectId
    jobId: string | ObjectId
    job?: JobType	
    createdAt: Date
    updatedAt: Date
}