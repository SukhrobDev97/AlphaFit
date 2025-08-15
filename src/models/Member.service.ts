import MemberModel from "../schema/Member.model"
import { Member, MemberInput, LoginInput } from "../libs/types/member"
import Errors, { HttpCode, Message } from "../libs/Errors"
import { MemberType } from "../libs/enums/member.enum"

class MemberService {
    private readonly memberModel
    constructor() {
        this.memberModel = MemberModel
    }

    public async processSignup(input: MemberInput): Promise<Member> {
        const exist = await this.memberModel
            .findOne({ memberType: MemberType.RESTAURANT })
            .exec();
        console.log("exist:", exist)
        if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        try {
            const result = await this.memberModel.create(input)
            result.memberPassword = ''
            return result
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED)
        }
    }


    public async processLogin(input:LoginInput): Promise<Member>{
        const member = await this.memberModel
        .findOne(
            {memberNick:input.memberNick},
            {memberNick: 1, memberPassword:1}
        )
        .exec()
        if(!member)throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK)
        const isMatch = input.memberPassword === member.memberPassword;
        if(!isMatch)throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD)
        
        return await this.memberModel.findById(member._id).exec();
    }
    
}

export default MemberService