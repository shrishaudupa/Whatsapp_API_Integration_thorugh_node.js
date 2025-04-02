import express from "express"

const webHookRoute = express.Router();

webHookRoute.get('/', (req, res) => {
    const VERIFY_TOKEN ='my_secret';
   
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
   
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
     console.log("Webhook verified successfully.");
     res.status(200).send(challenge);
    } else {
     console.log("Webhook verification failed.");
     res.sendStatus(403);
    }
   });

export default webHookRoute;