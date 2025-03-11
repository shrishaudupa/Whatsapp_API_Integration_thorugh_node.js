import 'dotenv/config';
import axios from 'axios';
import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.set('view engine', 'ejs');

app.set('views', './views'); 

app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to Whatsapp Api Integration application'});
});

async function sendTemplateMessage() {
  try {
    const response = await axios({
      url: process.env.URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
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
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
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
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
      },
      data: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.TO,
          type: 'image',
          image:{
              link: 'https://dummyimage.com/600x400/000/fff.png&text=Shrisha.io',
              caption: 'This is a media message'
          }
      })
  })

  

  console.log(response.data)    
}

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
