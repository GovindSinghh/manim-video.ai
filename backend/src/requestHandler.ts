import express, { Request, Response } from 'express';
import { generateScript } from './gptWrapper';

const router=express.Router();
let userPrompt:string="";

router.post("/userPrompt",(req:Request,res:Response):any =>{
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

router.get("/generateScript",async (req:Request,res:Response) : Promise<any> =>{
    if(!userPrompt){
        return res.status(403).json({
            message:"Please send the prompt first"
        });
    }

    const script=await generateScript(userPrompt);

    res.status(200).send({
        script,
        videoUrl:"https://www.youtube.com"
    });
})

export default router;