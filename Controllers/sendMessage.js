import axios from 'axios';
import { getAccessToken } from '../Services/getAccessToken.js';
import db from '../config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../config/.env') });

const date = new Date().toISOString().split('T')[0];
const now = new Date();
const time = now.toTimeString().split(' ')[0];

async function sendMessage(recipient, messageText) {
  if (!recipient) {
    console.error("Error: sendMessage called with no recipient.");
    return;
  }

  console.log(`Attempting to send to ${recipient}: "${messageText}"`);

  try {
    db.query(
      "INSERT into users_records values('Server',?,?,?,?)",
      [recipient, messageText, time, date],
      (err, result) => {
        if (err) {
          console.error("Database Insert Error:", err);
          return;
        }
        console.log("Database Insert Successful:", result);
      }
    );

    const accessToken = await getAccessToken();
    await axios.post(
      process.env.URL,
      {
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: messageText },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Message sent successfully to ${recipient}`);
  } catch (error) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message || error
    );

    if (typeof activeChatSocket !== 'undefined' && activeChatSocket.readyState === WebSocket.OPEN) {
      activeChatSocket.send(
        JSON.stringify({ type: "error", payload: "Failed to send message to WhatsApp." })
      );
    }
  }
}

export { sendMessage };

