import { hashPassword } from "@/app/helpers/bcrypt";
import { database } from "../config/mongodb";
import { z } from "zod";
import { UserType } from "@/types";

const UserSchema = z.object({
    name: z.string(),
    username: z.string({required_error: "Username is required"}).min(3, {message: "Username must contain at least 3 character(s)"}),
    email: z.string({required_error: "Email is required"}).email({message: "Invalid email address"}),
    password: z.string({required_error: "Password is required"}).min(5, {message: "Password must contain at least 5 character(s)"}),
})

type NewUser = {
    name: string;
    username: string;
    email: string;
    password: string;
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
            // createdAt: new Date(),
            // updatedAt: new Date()
        }
        
        // payload.password = hashPassword(payload.password);
        await this.collection().insertOne(newUser);
        return "Success"
    }
    static async findByUsername(username: string){
        return this.collection().findOne({ username });
    }
    static async findByEmail(email: string){
        return this.collection().findOne({ email });
    }
}

export default UserModel;