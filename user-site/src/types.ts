import { ObjectId } from "mongodb";

export type CustomError = {
    message: string;
    status: number;
}

export type UserType = {
    // _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
}

export type ProductType = {	
    _id: string;
    name: string;
    slug: string;
    description: string;
    excerpt: string;
    price: number;
    tags: string[];
    thumbnail: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type WishlistType = {
    _id: string
    userId: string | ObjectId
    productId: string | ObjectId
    product?: ProductType	
    createdAt: Date
    updatedAt: Date
}