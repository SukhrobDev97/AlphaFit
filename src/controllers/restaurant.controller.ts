import { Request, Response } from 'express';
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service"


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


restaurantController.processLogin = (req: Request, res: Response) => {
    try {
        console.log("processLogin")
        res.send('done')
    }
    catch (err) {
        console.log('Error, processLogin', err)
    }
}

restaurantController.processSignup = (req: Request, res: Response) => {
    try {
        console.log("processSignup")
        res.send('done')
    }
    catch (err) {
        console.log('Error, processSignup', err)
    }
}

export default restaurantController;


