import express from 'express';
import cors from 'cors';
import requestHandler from './requestHandler'

const app=express();
app.use(express.json());
app.use(cors());

app.use("/api",requestHandler);

const PORT=3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});