import express from "express";
import { sendTextMessage } from "../Controllers/sendTextMessage.js";

const sendTextRoute = express.Router();

sendTextRoute.post('/',async (req,res)=>{
    const userMessage = req.body.message;
    await sendTextMessage(userMessage);
    res.redirect('/');
  });

export default sendTextRoute;