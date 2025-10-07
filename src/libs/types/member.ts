import { Session } from "express-session";
import { MemberStatus, MemberType } from "../enums/member.enum";
import { ObjectId } from 'mongoose'
import mongoose from "mongoose";
import { OrderItemInput } from "./order";
import { Request } from 'express';


export interface Member {
    _id: ObjectId;
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface MemberUpdateInput {
    _id: ObjectId;
    memberStatus?: MemberStatus;
    memberNick?: string;
    memberPhone?: string;
    memberPassword?: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
}

export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberAddress?: string;
    memberDesc?: string;
    memberImage?: string;
    memberPoints?: number;
}

export interface LoginInput{
    memberNick:string;
    memberPassword: string;
}

export interface ExtentedRequest extends Request {
    member: Member;
    file: Express.Multer.File;
    files: Express.Multer.File[];
    cookies: {
        [key: string]: string;
      };
}


export interface AdminRequest extends Request{
    member: Member;
    session: Session & {member: Member};
    file: Express.Multer.File;
    files: Express.Multer.File[];
    
}