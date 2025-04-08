export type UserType = {
  user: any
  name: string
  email: string
  phoneNumber: string
  username: string
  password: string
  profile?: Profile
}

export type Profile = {
  avatar?: string
  location?: string
  bio?: string
  resume?: string
  skills?: string[]
  appliedJobs?: string[]
  savedJobs?: string[]
}

export type JobType = {
  _id: string
  name: string
  slug: string
  location: string
  category: string
  salary: string
  description: string
  excerpt: string
  company: Company
  detail: Detail
  createdAt: Date
  updatedAt: Date
}

export type Company = {
  name: string
  industry: string
  size: string
  website: string
  headquarters: string
  logo: string
}

export type Detail = {
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

