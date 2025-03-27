
import { ObjectId } from 'mongodb'

export type JobType = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    excerpt: string;
    salary: string; // Karena dalam JSON berbentuk string (misal: "Rp 15,000,000 - Rp 22,000,000")
    category: string;
    location: string;
    company: {
      name: string;
      industry: string;
      size: string;
      website: string;
      headquarters: string;
      logo: string;
    };
    detail: {
      responsibilities: string[];
      requirements: string[];
      benefits: string[];
    };
    createdAt?: Date; // Optional jika belum ada dalam data
    updatedAt?: Date; // Optional jika belum ada dalam data
  };
