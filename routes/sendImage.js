import express from "express";
import { sendMediaMessage } from "../Controllers/sendMediaMessage.js";

const sendImageRoute = express.Router();

sendImageRoute.post('/',(req,res)=>{
    sendMediaMessage();
    res.redirect("/");
   //  res.send('<h3>✅ Image message sent!</h3><a href="/">Go Back</a>')
   });

export default sendImageRoute;
