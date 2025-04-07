import type { UserType } from "./types"
import { currentUser } from "./data"

// Mock users data
let users: UserType[] = [currentUser]

export function getUsers() {
  return [...users]
}

export function getUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

export function getUserByUsername(username: string) {
  return users.find((user) => user.username === username)
}

export async function login(email: string, password: string) {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = getUserByEmail(email)

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password")
  }

  return user
}

export async function register(userData: Omit<UserType, "profile">) {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if email already exists
  if (getUserByEmail(userData.email)) {
    throw new Error("Email already in use")
  }

  // Check if username already exists
  if (getUserByUsername(userData.username)) {
    throw new Error("Username already taken")
  }

  const newUser: UserType = {
    ...userData,
    profile: {
      avatar: "/placeholder.svg?height=40&width=40",
      location: "",
      bio: "",
      skills: [],
    },
  }

  users = [...users, newUser]

  return newUser
}

