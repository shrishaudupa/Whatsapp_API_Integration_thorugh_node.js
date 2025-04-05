import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { getAccessToken } from '../Services/getAccessToken.js';
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname,'../config/.env')});


async function sendMediaMessage(recipient) {
    const response = await axios({
        url: process.env.URL,
        method: 'post',
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to: recipient,
            type: 'image',
            image:{
                link: 'https://dummyimage.com/600x400/000/fff.png&text=Shrisha Udupa',
                caption: 'This is a media message'
            }
        })
    })
  
    
  
    console.log(response.data)    
  }

export { sendMediaMessage };