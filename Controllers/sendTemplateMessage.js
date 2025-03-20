import axios from "axios";
import { getAccessToken } from "../Services/getAccessToken.js";
import { fileURLToPath } from 'url'; 
import dotenv from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path: path.resolve(__dirname,'../config/.env')});

async function sendTemplateMessage() {
    try {
      const response = await axios({
        url: process.env.URL,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.TO,
          type: 'template',
          template: {
            name: 'hello_world',
            language: {
              code: 'en_US',
            },
          },
        }),
      });
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Response Error:', error.response.data);
        console.error('Status Code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  export { sendTemplateMessage };