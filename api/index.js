const express = require('express');
const serverless = require('@vendia/serverless-express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.render('index', { message: 'Hello from Vercel!' });
});

module.exports = serverless({ app });
