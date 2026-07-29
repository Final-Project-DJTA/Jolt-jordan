import bcrypt from "bcryptjs"
import { connectDB } from "../lib/mongodb/api"
import { User, Job } from "../lib/mongodb/models"
import { jobs, currentUser } from "../lib/data"

async function seed() {
  try {
    console.log("Connecting to MongoDB...")
    await connectDB()

    console.log("Clearing existing data...")
    await User.deleteMany({})
    await Job.deleteMany({})

    console.log("Creating admin user...")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(currentUser.password, salt)

    const user = new User({
      ...currentUser,
      password: hashedPassword,
    })

    await user.save()
    console.log("Admin user created")

    console.log("Creating jobs...")
    const jobsWithoutIds = jobs.map((job) => {
      // Convert string IDs to ObjectIds for MongoDB
      const { _id, ...jobWithoutId } = job
      return jobWithoutId
    })

    await Job.insertMany(jobsWithoutIds)
    console.log(`${jobs.length} jobs created`)

    console.log("Seed completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()

