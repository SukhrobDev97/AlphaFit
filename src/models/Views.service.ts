import { ViewInput } from "../libs/types/view";
import { HttpCode } from "../libs/Errors";
import { Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import { View } from "../libs/types/view";
import ViewModel from "../schema/View.Model";

class ViewService {
    private readonly viewModel;

    constructor(){
        this.viewModel = ViewModel
    }

    public async checkViewExictance(input:ViewInput): Promise<View>{
        return await this.viewModel
        .findOne(
            {
                memberId: input.memberId,
                viewRefId: input.viewRefId
            }
        )
        .exec()
    }

    public async insertMemberView (input:ViewInput) :Promise <View>{
        try{
            return await this.viewModel.create(input)
        }
        catch(err){
            console.log("ERROR, model:insertMemberView ", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }
}

export default ViewService;