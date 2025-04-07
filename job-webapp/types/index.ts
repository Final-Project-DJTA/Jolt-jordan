// export type UserType = {
//   name: string
//   email: string
//   phoneNumber: string
//   username: string
//   password: string
//   profile?: Profile
// }

// export type Profile = {
//   avatar?: string
//   location?: string
//   bio?: string
//   resume?: string
//   skills?: string[]
//   appliedJobs?: string[]
//   savedJobs?: string[]
// }

// export type JobType = {
//   _id: string
//   name: string
//   slug: string
//   location: string
//   category: string
//   salary: string
//   description: string
//   excerpt: string
//   company: Company
//   detail: Detail
//   createdAt: Date
//   updatedAt: Date
// }

// export type Company = {
//   name: string
//   industry: string
//   size: string
//   website: string
//   headquarters: string
//   logo: string
// }

// export type Detail = {
//   responsibilities: string[]
//   requirements: string[]
//   benefits: string[]
// }

// // Import ObjectId from mongodb
// import { ObjectId } from 'mongodb';

// export type BookmarkType = {
//   _id: string
//   userId: string | ObjectId
//   jobId: string | ObjectId
//   job?: JobType
//   createdAt: Date
//   updatedAt: Date
// }

import { ObjectId } from "mongodb";

export type CustomError = {
    message: string;
    status: number;
}

export type UserType = {
    name: string;
    email: string;
    phoneNumber: string
    username: string;
    password: string;
    profile?: profile;
}

export type profile = {
    avatar?: string;
    location?: string;
    bio?: string
    resume?: string;
    skills?: string[];
    appliedJobs?: string[];
    savedJobs?: string[];
}

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

export type BookmarkStatus = "interested" | "not_interested" | "none"

export type BookmarkType = {
    _id: string
    userId: string | ObjectId
    jobId: string | ObjectId
    job?: JobType	
    status: string
    createdAt: Date
    updatedAt: Date
}
