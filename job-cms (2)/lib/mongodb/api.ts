import dbConnect from "./connection"
import * as utils from "./utils"

// Connect to MongoDB before exporting utilities
export const connectDB = dbConnect

// Export all utility functions
export const api = {
  ...utils,
}

export default api

