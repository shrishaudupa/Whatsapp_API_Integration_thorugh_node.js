# Whatsapp_API_Integration_thorugh_node.js

Built a WhatsApp API Integration Application using Express.js with a simple frontend in EJS and set up the backend to serve static files and render views while using dotenv to manage environment variables securely. The main feature of this project is WhatsApp messaging automation, where I integrated the Meta API to send text, template, and media messages. I used Axios to make API requests and implemented three functions: one for sending a predefined template message, another for sending a plain text message, and one for sending an image message with a caption.  created API routes (/send-template, /send-text, and /send-image) that trigger these functions and respond with confirmation messages. To ensure smooth operation, I also added error handling to log API failures. Overall, this project helps automate WhatsApp messages with a simple Express.js backend and an EJS-based frontend. 🚀

# Steps to do this project

## Step 1: Get Access to WhatsApp Business API
### Create a Meta Developer Account:<br>
Go to Meta for Developers and sign in.<br>
### Create an App:<br>
Navigate to My Apps > Create App > Choose Business as the app type.<br>
### Set Up WhatsApp API:<br>
In the Meta App Dashboard, add WhatsApp as a product.<br>
### Create a Business Account:<br>
You need a verified Meta Business Manager account.<br>
### Get a Phone Number:<br>
Register a phone number for sending messages.<br>
### Generate API Credentials<br>
Go to the WhatsApp section of your app.<br>
Generate a Temporary Access Token (valid for 24 hours).<br>
Save your Phone Number ID and WhatsApp Business Account ID.<br>

## Step 2: Create Node App
