import { Request, Response } from 'express';
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service"


const restaurantController: T = {};
restaurantController.goHome = (req: Request, res: Response) => {
    try {
        res.send('Home page')
    }
    catch (err) {
        console.log('Error, gohome', err)
    }
};

restaurantController.getLogin = (req: Request, res: Response) => {
    try {
        res.send('Login page')
    }
    catch (err) {
        console.log('Error, login', err)
    }
};

restaurantController.getSignup = (req: Request, res: Response) => {
    try {
        res.send('Signup page')
    }
    catch (err) {
        console.log('Error, signup', err)
    }
}

export default restaurantController;


