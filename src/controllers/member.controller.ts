import { Request, Response } from 'express';
import { T } from '../libs/types/common';


const memberController: T = {};
memberController.goHome = (req: Request, res: Response) => {
    try {
        res.send('Home page')
    }
    catch (err) {
        console.log('Error, gohome', err)
    }
};

memberController.getLogin = (req: Request, res: Response) => {
    try {
        res.send('Login page')
    }
    catch (err) {
        console.log('Error, login', err)
    }
};

memberController.getSignup = (req: Request, res: Response) => {
    try {
        res.send('Signup page')
    }
    catch (err) {
        console.log('Error, signup', err)
    }
}

export default memberController;


