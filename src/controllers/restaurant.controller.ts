import { Request, Response } from 'express';
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service"
import { AdminRequest, MemberInput } from '../libs/types/member';
import { MemberType } from '../libs/enums/member.enum';
import { LoginInput } from '../libs/types/member';

const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome")

        res.send('Home page')
    }
    catch (err) {
        console.log('Error, gohome', err)
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")

        res.send('Login page')
    }
    catch (err) {
        console.log('Error, login', err)
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignUp")

        res.send('Signup page')
    }
    catch (err) {
        console.log('Error, signup', err)
    }
}

restaurantController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);
        const input: LoginInput = req.body as unknown as LoginInput;

        const memberService = new MemberService();
        const result = await memberService.processLogin(input)

        req.session.member = result;
        req.session.save(function(){
            res.send(result);
        })
    }
    catch (err) {
        console.log('Error, processLogin', err)
        res.send(err)
    }
}

restaurantController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup")
        console.log('body:', req.body)

        const newMember: MemberInput = req.body as unknown as MemberInput;
        newMember.memberType = MemberType.RESTAURANT

        const memberService = new MemberService();
        const result = await memberService.processSignup(newMember);
        req.session.member = result;
        req.session.save(function(){
            res.send(result);
        })
    }
    catch (err) {
        console.log('Error, processSignup', err)
        res.send(err)
    }
}


export default restaurantController;


