import mongoose from "mongoose"

export type IUser = {
    _id:string,
    fullName: string,
    email: string,
    profilePic: string
}

export type TokenPayload = {
    id: string
}