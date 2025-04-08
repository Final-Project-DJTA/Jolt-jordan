import { ObjectId } from "mongodb";

export type CustomError = {
  message: string;
  status: number;
};

export type UserType = {
  _id?: string;
  name: string;
  email: string;
  username: string;
  password?: string; // Optional since we don't return password in responses
  telegramId?: string;
  telegramVerified?: boolean;
  role?: string;
  verificationToken?: string;
  tokenExpires?: Date;
  profile?: ProfileType; // Reference to profile
};

export type PersonalInfoType = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  summary?: string;
};

export type EducationType = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
};

export type ExperienceType = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ProfileType = {
  userId: string;
  avatar?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  tags?: string[];
  appliedJobs?: string[];
  savedJobs?: string[];
  personalInfo?: PersonalInfoType;
  education?: EducationType[];
  experience?: ExperienceType[];
};

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
};

export type company = {
  name: string;
  industry: string;
  size: string;
  website: string;
  headquarters: string;
  logo: string;
};

export type detail = {
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

export type BookmarkStatus = "interested" | "not_interested" | "none";

export type BookmarkType = {
    _id: string
    userId: string | ObjectId
    jobId: string | ObjectId
    job?: JobType	
    status: BookmarkStatus
    createdAt: Date
    updatedAt: Date
}
