// Job API functions
export async function fetchJobs(category?: string, search?: string) {
  let url = "/api/jobs"
  const params = new URLSearchParams()

  if (category) params.append("category", category)
  if (search) params.append("search", search)

  if (params.toString()) {
    url += `?${params.toString()}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return response.json()
}

export async function fetchJob(id: string) {
  const response = await fetch(`/api/jobs/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch job")
  }

  return response.json()
}

export async function createJob(jobData: any) {
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to create job")
  }

  return response.json()
}

export async function updateJob(id: string, jobData: any) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to update job")
  }

  return response.json()
}

export async function deleteJob(id: string) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete job")
  }

  return response.json()
}

// Auth API functions
export async function loginUser(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Invalid email or password")
  }

  return response.json()
}

export async function registerUser(userData: any) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || "Failed to register")
  }

  return response.json()
}

// Dashboard API functions
export async function fetchDashboardStats() {
  const response = await fetch("/api/dashboard/stats")

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics")
  }

  return response.json()
}

// Profile API functions
export async function fetchUserProfile() {
  const response = await fetch("/api/users/profile")

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}

export async function updateUserProfile(userData: any) {
  const response = await fetch("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Failed to update user profile")
  }

  return response.json()
}

