require('dotenv').config();
import express, { Request, Response } from 'express';
import { generateScript } from './gptWrapper';
import prisma from './lib/prisma';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './middleware';
import { publishScript } from './publisher';

const router=express.Router();
const JWT_SECRET=process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not given as enviroment variable");
}
interface signupData{
    email:string;
    password:string;
}
interface AuthRequest extends Request{
    user?:{
        userId:number;
        iat:number;
        exp:number;
    }
}

let userPrompt:string="";

router.post("/signup",async (req:Request,res:Response):Promise<any>=>{
    const body:signupData=req.body;
    
    const user = await prisma.user.findUnique({
        where: {
            email:body.email
        },
    });
    if(user){
        res.status(403).json({
            msg:"User Already exist"
        });
        return;
    }

    try{
        await prisma.user.create({
            data:{
                email: body.email,
                password: body.password
            },
        });
    }catch(error){
        res.status(403).json({
            message:error
        });
        return;
    }

    const userId = await prisma.user.findUnique({
        where:{
            email:body.email
        },
        select:{
            id:true
        },
    });

    const token = jwt.sign({ userId:userId?.id }, JWT_SECRET, { expiresIn:'5hr'});
    res.status(200).json({
        message:"User Created",
        token
    });
});

router.post("/userPrompt",authMiddleware,(req:AuthRequest,res:Response):any =>{
    const prompt:string=req.body.userPrompt;

    if(!prompt){
        return res.status(403).json({
            message:"User prompt is empty"
        });
    }
    else{
        userPrompt=prompt;
        res.status(200).json({
            message:"Prompt received !"
        });
    }
    
    
});

router.get("/generateScript",authMiddleware,async (req:AuthRequest,res:Response) : Promise<any> =>{
    if(!userPrompt){
        return res.status(403).json({
            message:"Please send the prompt first"
        });
    }
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const script = await generateScript(userPrompt);
    // Create the script
    try{
        const createdScript=await prisma.script.create({
            data: {
                userPrompt,
                script,
                videoUrl:"",
                userId
            }
        });
    
        await publishScript(createdScript.id,createdScript.script);
    }
    catch(error){
        res.status(500).json({
            message:"Try again, server busy"
        });
        return;
    }

    res.status(200).send({
        script,
        videoUrl:"https://www.youtube.com"
    });
})

export default router;