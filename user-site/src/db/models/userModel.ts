import { hashPassword, comparePassword} from "@/app/helpers/bcrypt";
import { database } from "../config/mongodb";
import { z } from "zod";
import { UserType } from "@/types";
import { ObjectId } from "mongodb";

const UserSchema = z.object({
    name: z.string(),
    username: z.string({required_error: "Username is required"}).min(3, {message: "Username must contain at least 3 character(s)"}),
    email: z.string({required_error: "Email is required"}).email({message: "Invalid email address"}),
    password: z.string({required_error: "Password is required"}).min(5, {message: "Password must contain at least 5 character(s)"}),
    phoneNumber: z.string().optional()
})

const ProfileSchema = z.object({
    avatar: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    resume: z.string().optional(),
    skills: z.array(z.string()).optional(),
    appliedJobs: z.array(z.string()).optional(),
    savedJobs: z.array(z.string()).optional(),
})

type NewUser = {
    name: string;
    username: string;
    email: string;
    password: string;
    phoneNumber?: string
}

class UserModel {
    static collection(){
        return database.collection<UserType>("User");
    }

    static async create(payload: NewUser){
        UserSchema.parse(payload);
        const user = await this.collection().findOne({
            $or: [
                { username: payload.username },
                { email: payload.email },
            ]
        })

        if(user)
            throw { message: "Username or email already exists", status: 400 };

        const newUser = {
            ...payload,
            password: hashPassword(payload.password),
            profile: {}
            // createdAt: new Date(),
            // updatedAt: new Date()
        }
        
        // payload.password = hashPassword(payload.password);
        await this.collection().insertOne(newUser);
        return "Register Success"
    }

    static async login(email: string, password: string){
        const user = await this.collection().findOne({email})
        if(!user) throw { message: "Invalid email or password", status: 401}

        const isValid = comparePassword(password, user.password)
        if(!isValid) throw { message: "Invalid email or password", status: 401}

        return{
            message: "Login successful!",
            userId: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        }
    }

    static async getProfile(userId: string){
        const user = await this.collection().findOne({_id: new ObjectId(userId)})

        if(!user) throw { message: "User not found", status: 404 }
        const {password, ...safeData} = user
        return safeData
    }

    static async editProfile(userId: string, profileData: Partial<UserType["profile"]>){
        ProfileSchema.parse(profileData)

        const updateData: any = {}
        Object.entries(profileData).forEach(([Key, value]) => {
            updateData[`profile.${key}`] = value
        })

        const result = await this.collection().updateOne(
            {_id: new ObjectId(userId)},
            {$set: updateData}
        )

        if(result.matchedCount === 0){
            throw {message: "User not found", status: 404}
        }

        return "Profile updated successfully"
    }
}

export default UserModel;
