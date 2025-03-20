import express from "express";
import { sendTemplateMessage } from "../Controllers/sendTemplateMessage.js";

const templateRoutes = express.Router();



templateRoutes.post('/',(req,res)=>{
    sendTemplateMessage();
    res.send('<h3>✅ Template message sent!</h3><a href="/">Go Back</a>')
   })

export default templateRoutes;