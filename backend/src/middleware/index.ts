import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { decode } from "punycode";
const JWT_SECRET = process.env.JWT_SECRET as string;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const data = req.headers['authorization'];
    const token = data?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

