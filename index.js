import dotenv from 'dotenv';
import axios from 'axios';
import express, { urlencoded, json } from "express";
import bodyParser from "body-parser";
import cleverbot from "cleverbot-free";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { getAccessToken } from './Services/getAccessToken.js';
import { getPageDetails } from './Controllers/getPageDetails.js';
import { WebSocketServer } from 'ws';
import http from 'http';
import db from './config/db.js';
import { sendMessage } from './Controllers/sendMessage.js'
import { sendMediaMessage } from './Controllers/sendMediaMessage.js'


const date = new Date().toISOString().split('T')[0];
const now = new Date();
const time = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

import webHookRoute from './routes/Webhook.js';
import templateRoutes from './routes/sendTemplate.js';
import sendTextRoute from './routes/sendText.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './config/.env') });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 4000;
const VERIFY_TOKEN = "my_secure";
var TARGET_WHATSAPP_NUMBER ='919844504748'

if (!TARGET_WHATSAPP_NUMBER) {
  console.error("Error: Environment variable 'TO' (target WhatsApp number) is not set.");
  process.exit(1);
}

app.use(bodyParser.json());
app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let activeChatSocket = null;

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  if (activeChatSocket && activeChatSocket !== ws) {
    console.log('Replacing existing active chat socket.');
    activeChatSocket.close(1000, 'Replaced by new connection');
  }
  activeChatSocket = ws;

  ws.on('message', async (message) => {
    console.log('Received message from web client:', message.toString());
    try {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === 'chat_message' && parsedMessage.payload) {
        const textToSend = parsedMessage.payload;
        await sendMessage(TARGET_WHATSAPP_NUMBER, textToSend);
      } else {
        console.log("Received unknown message format from client:", parsedMessage);
      }
    } catch (error) {
      console.error('Failed to process WebSocket message or send to WhatsApp:', error);
      ws.send(JSON.stringify({ type: 'error', payload: 'Failed to process your message.' }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected. Code: ${code}, Reason: ${reason ? reason.toString() : 'N/A'}`);
    if (activeChatSocket === ws) {
      console.log('Active chat socket disconnected.');
      activeChatSocket = null;
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (activeChatSocket === ws) {
      activeChatSocket = null;
    }
  });

  ws.send(JSON.stringify({ type: 'connection_ack', payload: 'WebSocket connection established.' }));
});

let activeChats = new Map();
const TOKEN_FILE_PATH = "./whatsapp_token.json";
app.get('/', (req, res) => {
  db.query('SELECT numbers FROM phone_numbers', function(err, data) {
    if (err) {
      return res.status(500).send('Database error!');
    }
    const phone_numbers = data.map(row => row.numbers); // extract only the values
    res.render('index', {
      title: 'Welcome to Whatsapp Api Integration application',
      phone_numbers: phone_numbers
    });
  });
});

app.post('/submit', (req, res) => {
  const selectedPhoneNumber = req.body.phonenumber;
  console.log('--- POST /submit hit ---');
  console.log('Body:', req.body);
  console.log('Selected phone number:', selectedPhoneNumber);
  TARGET_WHATSAPP_NUMBER = selectedPhoneNumber;
  console.log('TARGET_WHATSAPP_NUMBER :',TARGET_WHATSAPP_NUMBER)
  if (!selectedPhoneNumber) {
    return res.send("No phone number selected.");
}
  return res.redirect('/');
});

app.use("/webhook", webHookRoute);

app.post("/webhook", async (req, res) => {
  console.log("Incoming WhatsApp Webhook:", JSON.stringify(req.body, null, 2));

  const entry = req.body?.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  if (value?.messaging_product === "whatsapp" && value?.messages?.length > 0) {
    const message = value.messages[0];
    const sender = message.from;
    const messageType = message.type;

    if (messageType === "text" && sender === TARGET_WHATSAPP_NUMBER) {
      const text = message.text?.body;

      db.query(
        "INSERT INTO users_records VALUES (?, 'Server',?,?,?)",
        [TARGET_WHATSAPP_NUMBER, text,time,date],
        (err, result) => {
          if (err) {
            console.error("Database Insert Error:", err);
            return;
          }
          console.log("Database Insert Successful:", result);
        }
      );
      console.log(`Received text message from ${sender}: "${text}"`);

      if (activeChatSocket && activeChatSocket.readyState === WebSocket.OPEN) {
        console.log("Forwarding message to active WebSocket client.");
        activeChatSocket.send(JSON.stringify({ type: 'whatsapp_message', payload: text }));
      } else {
        console.log("No active WebSocket client to forward the message to.");
      }
    } else {
      console.log(`Ignoring message type '${messageType}' or sender '${sender}' (expected '${TARGET_WHATSAPP_NUMBER}')`);
    }
  } else {
    console.log("Received webhook event is not a WhatsApp message or is empty.");
  }

  res.sendStatus(200);
});

getPageDetails(await getAccessToken())

app.get("/webhook", (req, res) => {
  let challenge = req.query["hub.challenge"];
  console.log("Received challenge:", challenge);
  res.status(200).send(challenge);
});

app.use('/send-template', templateRoutes);

app.use('/send-text', sendTextRoute);

app.post("/webhook", (req, res) => {
  console.log("Facebook Webhook Event Received:", JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

app.post('/send-image',(req,res)=>{
  sendMediaMessage(TARGET_WHATSAPP_NUMBER);
  res.redirect("/");
 //  res.send('<h3>✅ Image message sent!</h3><a href="/">Go Back</a>')
 });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
  console.log(`Targeting WhatsApp number: ${TARGET_WHATSAPP_NUMBER}`);
  console.log(`Webhook Verify Token: ${VERIFY_TOKEN}`);
});