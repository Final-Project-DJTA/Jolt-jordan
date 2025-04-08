import type { JobType, UserType } from "./types"

// Mock user data
export const currentUser: UserType = {
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  username: "johndoe",
  password: "password123",
  profile: {
    avatar: "/placeholder.svg?height=40&width=40",
    location: "New York, USA",
    bio: "Experienced HR Manager with 5+ years in tech recruitment",
    skills: ["Recruitment", "HR Management", "Talent Acquisition"],
  },
}

// Mock job categories
export const jobCategories = [
  "Technology",
  "Marketing",
  "Finance",
  "Design",
  "Sales",
  "Customer Service",
  "Engineering",
  "Healthcare",
  "Education",
  "Other",
]

// Mock job data
export const jobs: JobType[] = [
  {
    _id: "1",
    name: "Senior Frontend Developer",
    slug: "senior-frontend-developer",
    location: "Remote",
    category: "Technology",
    salary: "$90,000 - $120,000",
    description: "We are looking for an experienced Frontend Developer to join our team.",
    excerpt: "Join our team as a Senior Frontend Developer and help build amazing user experiences.",
    company: {
      name: "TechCorp",
      industry: "Software Development",
      size: "50-100",
      website: "https://techcorp.com",
      headquarters: "San Francisco, CA",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Develop new user-facing features",
        "Build reusable code and libraries for future use",
        "Ensure the technical feasibility of UI/UX designs",
        "Optimize application for maximum speed and scalability",
      ],
      requirements: [
        "3+ years experience with React",
        "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model",
        "Thorough understanding of React.js and its core principles",
        "Experience with popular React.js workflows (such as Flux or Redux)",
      ],
      benefits: ["Competitive salary", "Health insurance", "Flexible working hours", "Remote work options"],
    },
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-20"),
  },
  {
    _id: "2",
    name: "UX/UI Designer",
    slug: "ux-ui-designer",
    location: "New York, NY",
    category: "Design",
    salary: "$70,000 - $90,000",
    description: "We're seeking a talented UX/UI Designer to create amazing user experiences.",
    excerpt: "Create beautiful and functional designs for our products as our new UX/UI Designer.",
    company: {
      name: "DesignHub",
      industry: "Design Agency",
      size: "10-50",
      website: "https://designhub.com",
      headquarters: "New York, NY",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Create user flows, wireframes, prototypes and mockups",
        "Translate requirements into style guides, design systems, design patterns and attractive user interfaces",
        "Design UI elements such as input controls, navigational components and informational components",
        "Create original graphic designs (e.g. images, sketches and tables)",
      ],
      requirements: [
        "Proven experience as a UI/UX Designer or similar role",
        "Portfolio of design projects",
        "Knowledge of wireframe tools (e.g. Wireframe.cc and InVision)",
        "Up-to-date knowledge of design software like Adobe Illustrator and Photoshop",
      ],
      benefits: [
        "Creative work environment",
        "Professional development opportunities",
        "Health and dental insurance",
        "Paid time off",
      ],
    },
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    _id: "3",
    name: "Marketing Manager",
    slug: "marketing-manager",
    location: "Chicago, IL",
    category: "Marketing",
    salary: "$80,000 - $100,000",
    description: "Lead our marketing efforts and drive brand growth.",
    excerpt: "Join our team as a Marketing Manager and help us reach new audiences.",
    company: {
      name: "GrowthCo",
      industry: "Marketing",
      size: "50-100",
      website: "https://growthco.com",
      headquarters: "Chicago, IL",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Develop marketing strategies to reach target audience",
        "Set up and manage digital marketing campaigns",
        "Prepare and manage marketing budgets",
        "Track and analyze marketing performance metrics",
      ],
      requirements: [
        "5+ years of marketing experience",
        "Experience with digital marketing platforms",
        "Strong analytical skills",
        "Excellent communication skills",
      ],
      benefits: ["Competitive salary", "Performance bonuses", "Health benefits", "401(k) matching"],
    },
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    _id: "4",
    name: "Backend Developer",
    slug: "backend-developer",
    location: "Austin, TX",
    category: "Technology",
    salary: "$85,000 - $110,000",
    description: "Build robust backend systems for our growing platform.",
    excerpt: "Join our engineering team as a Backend Developer and help scale our infrastructure.",
    company: {
      name: "ServerStack",
      industry: "Software Development",
      size: "10-50",
      website: "https://serverstack.com",
      headquarters: "Austin, TX",
      logo: "/placeholder.svg?height=40&width=40",
    },
    detail: {
      responsibilities: [
        "Design and implement backend services",
        "Optimize application for performance and scalability",
        "Collaborate with frontend developers",
        "Write clean, maintainable code",
      ],
      requirements: [
        "3+ years experience with Node.js or Python",
        "Experience with databases (SQL and NoSQL)",
        "Understanding of server-side templating languages",
        "Knowledge of API design and development",
      ],
      benefits: ["Competitive salary", "Stock options", "Flexible working hours", "Professional development budget"],
    },
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-25"),
  },
]

// CRUD operations
let jobsData = [...jobs]

export function getJobs() {
  return [...jobsData]
}

export function getJob(id: string) {
  return jobsData.find((job) => job._id === id)
}

export function createJob(job: Omit<JobType, "_id" | "createdAt" | "updatedAt">) {
  const newJob: JobType = {
    ...job,
    _id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  jobsData = [...jobsData, newJob]
  return newJob
}

export function updateJob(id: string, job: Partial<JobType>) {
  jobsData = jobsData.map((j) => (j._id === id ? { ...j, ...job, updatedAt: new Date() } : j))

  return jobsData.find((j) => j._id === id)
}

export function deleteJob(id: string) {
  const job = jobsData.find((j) => j._id === id)
  jobsData = jobsData.filter((j) => j._id !== id)
  return job
}

// Dashboard statistics
export function getDashboardStats() {
  return {
    totalJobs: jobsData.length,
    newApplications: 12,
    activeJobs: jobsData.filter((j) => new Date(j.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000).length,
    viewsToday: 156,
    popularCategories: [
      { name: "Technology", count: jobsData.filter((j) => j.category === "Technology").length },
      { name: "Marketing", count: jobsData.filter((j) => j.category === "Marketing").length },
      { name: "Design", count: jobsData.filter((j) => j.category === "Design").length },
    ],
  }
}

