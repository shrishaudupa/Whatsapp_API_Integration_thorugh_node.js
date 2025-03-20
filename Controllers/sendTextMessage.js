import axios from 'axios';
import { getAccessToken } from '../Services/getAccessToken.js';
import { fileURLToPath } from "url";
import path from 'path';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname,'../config/.env')});

async function sendTextMessage(chatText) {
  try {
      const response = await axios({
          url: process.env.URL,
          method: 'POST',
          headers: {
              Authorization: `Bearer ${await getAccessToken()}`,
              'Content-Type': 'application/json',
          },
          data: {
              messaging_product: 'whatsapp',
              to: process.env.TO,
              type: 'text',
              text: { body: chatText }
          },
      });
      console.log("Message sent:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
  }
}


export { sendTextMessage};