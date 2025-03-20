import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import bodyParser from "body-parser";
import fs from "fs"

const VERIFY_TOKEN = "my_secure_token";

const app = express();
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.set('view engine', 'ejs');

app.set('views', './views'); 


const TOKEN_FILE_PATH = "./whatsapp_token.json";

function getAccessToken() {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, "utf-8"));
        return tokenData.access_token;
    } else {
        console.error("❌ ERROR: Token file not found!");
        return null;
    }
}

app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to Whatsapp Api Integration application'});
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


async function getPageDetails(accessToken){
  const url = `https://graph.facebook.com/v22.0/{form_id}/leads?access_token=${accessToken}
`;

  try{
    const response = await axios.get(url);
    console.log(response.data);
  }catch(error){
    console.error("Error fething user data", error.response ? error.response.data : error.message)
  }

}

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


async function sendTextMessage(){
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
      type: 'text',
      text: {
        body:'This is a text message'
      },
    }),
  });
  console.log(response.data);
}

async function sendMediaMessage() {
  const response = await axios({
      url: process.env.URL,
      method: 'post',
      headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.TO,
          type: 'image',
          image:{
              link: 'https://dummyimage.com/600x400/000/fff.png&text=Shrisha Udupa',
              caption: 'This is a media message'
          }
      })
  })

  

  console.log(response.data)    
}

getPageDetails(await getAccessToken())



app.get("/webhook", (req, res) => {
  let challenge = req.query["hub.challenge"];
  console.log("Received challenge:", challenge);
  res.status(200).send(challenge);
});


app.post('/send-template',(req,res)=>{
  sendTemplateMessage();
  res.send('<h3>✅ Template message sent!</h3><a href="/">Go Back</a>')
})

app.post('/send-image',(req,res)=>{
  sendMediaMessage();
  res.send('<h3>✅ Image message sent!</h3><a href="/">Go Back</a>')
})
app.post('/send-text',(req,res)=>{
  sendTextMessage();
  res.send('<h3>✅ Template image sent!</h3><a href="/">Go Back</a>')
})
app.post("/webhook", (req, res) => {
  console.log("Facebook Webhook Event Received:", JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
