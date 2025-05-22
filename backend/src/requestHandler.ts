import 'dotenv/config';
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
    password:number;
}
interface AuthRequest extends Request{
    user?:{
        userId:number;
        iat:number;
        exp:number;
    }
}

router.post("/signup",async (req:Request,res:Response):Promise<any>=>{
    const body:signupData=req.body;

    try{
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

    
        const newUser=await prisma.user.create({
            data:{
                email: body.email,
                password: body.password
            },
        });
    
        const token = jwt.sign({ userId:newUser.id }, JWT_SECRET, { expiresIn:'5hr'});
        res.status(200).json({
            message:"User Created",
            token
        });
    }catch(error){
        res.status(502).json({
            message:"Try again! Something seems to be down",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
});

router.post("/login",async (req:AuthRequest,res:Response):Promise<any>=>{
    const body:signupData=req.body;

    try{
        const user = await prisma.user.findFirst({
            where: {
                email:body.email,
                password:body.password
            },
            select:{
                id:true
            }
        });
        if(!user){
            res.status(403).json({
                msg:"User doesn't exist! Try signup first"
            });
            return;
        }

        const token=jwt.sign({ userId : user.id},JWT_SECRET,{ expiresIn:'5h' });

        res.status(200).json({
            message:"Logged in Successfully",
            token
        });
    
    }catch(error){
        res.status(403).json({
            message:"Login failed",
            error:`Error ${error}`
        });
        return;
    }
});

router.post("/userPrompt",authMiddleware,async (req:AuthRequest,res:Response):Promise<any> =>{
    console.log("1 executed");
    const prompt:string=req.body.userPrompt;
    const userId = req.user?.userId;
    console.log("2 executed");
    if(!prompt){
        return res.status(403).json({
            message:"User prompt is empty"
        });
    }
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const createdScript = await prisma.script.create({
            data: {
                userPrompt: prompt,
                script: "",
                videoUrl: "",
                userId: userId
            }
        });
        console.log("3 executed");
        
        res.status(200).json({
            message: "Prompt received!",
            scriptId: createdScript.id
        });
    } catch (error) {
        console.error('Error saving prompt:', error);
        res.status(500).json({
            message: "Error saving prompt"
        });
    }
});

router.get("/generateScript",authMiddleware,async (req:AuthRequest,res:Response) : Promise<any> =>{
    const scriptId=parseInt(req.query.scriptId as string);
    try{
        const scriptData=await prisma.script.findUnique({
            where:{
                id:scriptId
            },
            select:{
                userPrompt:true,
            }
        })
        if(!scriptData){
            res.status(403).json({
                message:"Please send the prompt first"
            });
            return;
        }
        
        const receivedResponse = await generateScript(scriptData.userPrompt);
        
        const script=receivedResponse.script;
        const sceneName=receivedResponse.sceneName;


    
        const publishScriptRes_from_MQ=await publishScript(scriptId,script,sceneName);

        // update the record and get the videoUrl
        if(script){
            const createdScriptRes=await prisma.script.update({
                where:{
                    id:scriptId
                },
                data:{
                    script: script,
                    videoUrl:"https://www.youtube.com" // this should be updated by worker to actual Url
                },
                select:{
                    videoUrl:true,
                    script:true
                }
            });
    
            res.status(200).json({
                script: script,
                videoUrl: createdScriptRes.videoUrl
            });
        } else {
            res.status(500).json({
                message: "Failed to generate script"
            });
        }
    }
    catch(error){
        console.error('Error generating script:', error);
        res.status(500).json({
            message:`Try again, something went wrong: ${error}`
        });
        return;
    }
})

export default router;