import { sendTextMessage } from "./sendTextMessage.js";

const VERIFY_TOKEN = "my_secure_token";

export const handleWebhookVerification = (req, res) => {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": challenge } = req.query;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed.");
    res.sendStatus(403);
  }
};

export const handleWebhookEvent = async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    body.entry.forEach((entry) => {
      entry.changes.forEach((change) => {
        if (change.value.messages) {
          change.value.messages.forEach(async (message) => {
            const from = message.from;
            const text = message.text?.body;

            console.log(`📩 Received message from ${from}: ${text}`);
            await sendTextMessage(from, `Received: "${text}"`);
          });
        }
      });
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
