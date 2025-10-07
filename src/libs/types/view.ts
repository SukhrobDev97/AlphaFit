import { ObjectId } from 'mongoose'
import { ViewGroup } from '../enums/view.enum';


export interface View {
    _id: ObjectId;
    viewGroup: ViewGroup;
    memberId: ObjectId;
    viewRefId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ViewInput{
    viewGroup: ViewGroup;
    memberId: ObjectId;
    viewRefId: ObjectId;
}