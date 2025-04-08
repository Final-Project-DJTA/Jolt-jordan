import { hashPassword, comparePassword } from "@/helpers/bcrypt";
import { database } from "../config/mongodb";
import { z } from "zod";
import { ObjectId } from "mongodb";
import ProfileModel from "./profileModel";

// Remove ProfileSchema as it's now in ProfileModel

const UserSchema = z.object({
  name: z.string(),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must contain at least 3 character(s)" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(5, { message: "Password must contain at least 5 character(s)" }),
});

type NewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
  telegramId?: string;
  role: string;
};

// Update UserType in types.ts as well

class UserModel {
  static collection() {
    return database.collection("User");
  }

  static async create(payload: NewUser) {
    try {
      UserSchema.parse(payload);
      const user = await this.collection().findOne({
        $or: [{ username: payload.username }, { email: payload.email }],
      });

      if (user) throw { message: "Username or email already exists", status: 400 };

      const newUser = {
        ...payload,
        password: hashPassword(payload.password),
        role: payload.role || "user",
        telegramId: payload.telegramId || "",
      };

      const result = await this.collection().insertOne(newUser);
      
      // Create a profile for the new user - enforcing one-to-one relationship
      try {
        await ProfileModel.create(result.insertedId.toString());
        console.log(`Profile created for user ID: ${result.insertedId}`);
      } catch (error) {
        console.error("Failed to create profile:", error);
        // You could choose to delete the user if profile creation fails
        // to maintain data consistency, but that's a design decision
      }
      
      return "Register Success";
    } catch (error) {
      console.error("Error in user creation:", error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    const user = await this.collection().findOne({ email });
    if (!user) throw { message: "Invalid email or password", status: 401 };

    const isValid = comparePassword(password, user.password);
    if (!isValid) throw { message: "Invalid email or password", status: 401 };

    return {
      message: "Login successful!",
      userId: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
  }

  static async getProfile(userId: string) {
    const user = await this.collection().findOne({ _id: new ObjectId(userId) });

    if (!user) throw { message: "User not found", status: 404 };
    const { password, ...safeData } = user;
    return safeData;
  }

  // Remove editProfile method that updates embedded profile
  // It's now handled by ProfileModel.update

  static async findByEmail(email: string) {
    const user = await this.collection().findOne({ email });
    return user;
  }

  static async updateTelegramId(email: string, telegramId: string, verified: boolean = false) {
    const user = await this.findByEmail(email);
    
    if (!user) throw { message: "User not found", status: 404 };
    
    const result = await this.collection().updateOne(
      { email },
      { $set: { telegramId, telegramVerified: verified } }
    );

    if (result.matchedCount === 0) {
      throw { message: "User not found", status: 404 };
    }

    return "Telegram ID updated successfully";
  }

  static async verifyTelegramId(userId: string) {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { $set: { telegramVerified: true } }
    );

    if (result.matchedCount === 0) {
      throw { message: "User not found", status: 404 };
    }

    return "Telegram ID verified successfully";
  }

  static async generateVerificationToken(userId: string) {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    const result = await this.collection().updateOne(
      { _id: new ObjectId(userId) },
      { $set: { verificationToken: token, tokenExpires: new Date(Date.now() + 24*60*60*1000) } } // Token valid for 24 hours
    );

    if (result.matchedCount === 0) {
      throw { message: "User not found", status: 404 };
    }

    return token;
  }

  static async verifyTokenAndUpdateTelegramId(token: string, telegramId: string) {
    const user = await this.collection().findOne({ 
      verificationToken: token,
      tokenExpires: { $gt: new Date() }
    });

    if (!user) throw { message: "Invalid or expired token", status: 400 };

    const result = await this.collection().updateOne(
      { _id: user._id },
      { 
        $set: { 
          telegramId: telegramId,
          telegramVerified: true 
        },
        $unset: { 
          verificationToken: "",
          tokenExpires: "" 
        }
      }
    );

    return "Telegram ID verified successfully";
  }

  /**
   * Delete a user and their associated profile
   * Implements cascade delete for the one-to-one relationship
   */
  static async deleteUser(userId: string) {
    try {
      // First check if the user exists
      const user = await this.collection().findOne({ _id: new ObjectId(userId) });
      if (!user) {
        throw { message: "User not found", status: 404 };
      }

      // Start a session for transactional operations
      const session = database.client.startSession();
      
      try {
        // Use a transaction to ensure both operations succeed or both fail
        await session.withTransaction(async () => {
          // Delete the profile first (foreign key relationship)
          const profileResult = await ProfileModel.collection().deleteOne(
            { userId: new ObjectId(userId) },
            { session }
          );
          
          console.log(`Deleted profile for user ${userId}: ${profileResult.deletedCount} document(s) removed`);
          
          // Then delete the user
          const userResult = await this.collection().deleteOne(
            { _id: new ObjectId(userId) },
            { session }
          );
          
          console.log(`Deleted user ${userId}: ${userResult.deletedCount} document(s) removed`);
          
          if (userResult.deletedCount === 0) {
            throw { message: "Failed to delete user", status: 500 };
          }
        });
        
        return { message: "User and associated profile deleted successfully" };
      } catch (error) {
        console.error(`Transaction error while deleting user ${userId}:`, error);
        throw error;
      } finally {
        // End the session
        await session.endSession();
      }
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  }
}

export default UserModel;
