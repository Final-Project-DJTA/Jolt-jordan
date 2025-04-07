import { hashSync, compareSync } from "bcryptjs";

export const hashPassword = (password: string): string => hashSync(password);
export const comparePassword = (password: string, hashPedPassword: string) => compareSync(password, hashPedPassword);  