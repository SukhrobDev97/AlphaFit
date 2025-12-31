import { NextFunction, Request, Response } from 'express';
import { T } from "../libs/types/common";
import MemberService from '../models/Member.service';
import { AdminRequest, MemberInput } from '../libs/types/member';
import { MemberType } from '../libs/enums/member.enum';
import { LoginInput } from '../libs/types/member';
import Errors, { HttpCode, Message } from '../libs/Errors';
import fetch from "node-fetch"
import { config } from 'dotenv/lib/main';
import DashboardService from "../models/Dashboard.service";


const memberService = new MemberService()
const dashboardService = new DashboardService(); // 👈 instance yaratish kerak

const storeController: T = {};
storeController.goHome = async (req: Request, res: Response) => {
    try {
        console.log("goHome")
        
        // Always initialize activity and alerts arrays
        let activity: any[] = [];
        let alerts: any[] = [];
        
        // If user is authenticated, fetch activity and alerts data
        const sessionInstance = req.session as T;
        if (sessionInstance?.member?.memberType === MemberType.STORE) {
            try {
                activity = await dashboardService.getTodayActivity() || [];
                alerts = await dashboardService.getSystemAlerts() || [];
                
                // Debug logging
                console.log('ACTIVITY:', JSON.stringify(activity, null, 2));
                console.log('ALERTS:', JSON.stringify(alerts, null, 2));
                console.log('Activity length:', activity.length);
                console.log('Alerts length:', alerts.length);
            } catch (serviceError) {
                console.error('Error fetching activity/alerts:', serviceError);
                // Keep empty arrays if service fails
            }
        }
        
        res.render('home', {
            activity: activity,
            alerts: alerts
        });
    }
    catch (err) {
        console.log('Error, gohome', err)
        // Even on error, render with empty arrays
        res.render('Home', {
            activity: [],
            alerts: []
        });
    }
};

storeController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin")
        res.render('Login')
    }
    catch (err) {
        console.log('Error, login', err)
        res.redirect("/admin")
    }
};

storeController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignUp")
        res.render('Signup')
    }
    catch (err) {
        console.log('Error, signup', err)
        res.redirect("/admin")
    }

}

storeController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup");

        // CAPTCHA tokenni olish
        const recaptchaToken = (req.body as any)?.['g-recaptcha-response'];
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        console.log("SECRET KEY:", process.env.RECAPTCHA_SECRET_KEY)
        if (!recaptchaToken) {
            return res.send(`<script>alert("Iltimos, CAPTCHAni tasdiqlang");window.location.replace("/admin/signup")</script>`);
        }

        // Google API orqali tekshirish
       
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`,
            { method: "POST" }
        );
        const data = await response.json();
        if (!data.success) {
            return res.send(`<script>alert("CAPTCHA is not proceeded");window.location.replace("/admin/signup")</script>`);
        }

        // Faylni tekshirish
        const file = req.file;
        if (!file)
            throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

        const newMember: MemberInput = req.body as unknown as MemberInput
        newMember.memberType = MemberType.STORE

        const result = await memberService.processSignup(newMember);
        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        })

    } catch (err) {
        console.log('Error, processSignup', err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");window.location.replace("/admin/signup")</script>`)
    }
}



storeController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
        console.log("body:", req.body);
        const input: LoginInput = req.body as unknown as LoginInput

        const memberService = new MemberService();
        const result = await memberService.processLogin(input)

        //session authentication;

        req.session.member = result;
        req.session.save(function () {
            res.redirect("/admin/product/all");
        })
    }
    catch (err) {
        console.log('Error, processLogin', err)
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script>alert("${message}");window.location.replace("/admin/login")</script>`)
    }
};

//DASHBOARD

 storeController.getMonthlySales = async (req: Request, res: Response) => {
  try {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const sales = await dashboardService.getMonthlySales(year, month);
    
    res.render("chart", {
      title: "Dashboard",
      sales
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

storeController.getTodayStats = async (req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getTodayStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error('Error, getTodayStats:', err);
    console.error('Error details:', JSON.stringify(err, null, 2));
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};


storeController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("logout");
        req.session.destroy(function () {
            res.redirect("/admin");
        })
    }
    catch (err) {
        console.log('Error, logout', err)
        res.render("/admin/login")
    }
};

storeController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUSers");
        const result = await memberService.getUsers();

        res.render('users', { users: result })
    }
    catch (err) {
        console.log('Error, getUsers', err)
        res.redirect("/admin")
    }
};

storeController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenUser")
        const result = await memberService.updateChosenUser(req.body);
        res.status(HttpCode.OK).json({ data: result })
    }
    catch (err) {
        console.log('Error, updateChosenUser', err)
        console.log('Error, signup', err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard)
    }
};



storeController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        console.log("checkAuthSession");
        if (req.session?.member)
            res.send(`<script>alert("${req.session.member.memberNick}")</script>`);
        else res.send(`<script>alert("${Message.NOT_AUTHENTICATED}")</script>`)
    } catch (err) {
        console.log('Error,checkAuthSession ', err)
        res.send(err)
    }
};

storeController.verifyStore = (req: AdminRequest, res: Response, next: NextFunction) => {
    if (req.session?.member?.memberType === MemberType.STORE) {
        req.member = req.session.member;
        next()
    } else {
        const message = Message.NOT_AUTHENTICATED
        res.send(`<script>alert("${message}");window.location.replace('/admin/login');</script>`)
    }
}




export default storeController;


