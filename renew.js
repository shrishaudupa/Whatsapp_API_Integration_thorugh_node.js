import axios from "axios";
import fs from "fs";
import cron from "node-cron";
import 'dotenv/config';

const WHATSAPP_API_URL = "https://graph.facebook.com/v22.0/oauth/access_token";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_FILE_PATH = "./whatsapp_token.json";
const LAST_REFRESH_FILE_PATH = "./last_refresh.json"

// Load Access Token from JSON or .env (fallback)
function getAccessToken() {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, "utf-8"));
        return tokenData.access_token;
    }
    return process.env.ACCESS_TOKEN; // Fallback to .env
}

function saveAccessToken(token) {
    const tokenData = {
        access_token: token,
        expires_in: 5184000, // 60 days
        timestamp: Date.now()
    };
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2));
    saveLastRefreshTime();
}

function getLastRefreshTime() {
    if (fs.existsSync(LAST_REFRESH_FILE_PATH)){
        return JSON.parse(fs.readFileSync(LAST_REFRESH_FILE_PATH, "utf-8")).lastRefresh;
    }
    return 0;
}

function saveLastRefreshTime(){
    const lastRefreshData = {lastRefresh: Date.now()};
    fs.writeFileSync(LAST_REFRESH_FILE_PATH, JSON.stringify(lastRefreshData, null, 2));
}

async function refreshAccessToken() {
    try {
        const response = await axios.get(WHATSAPP_API_URL, {
            params: {
                grant_type: "fb_exchange_token",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                fb_exchange_token: getAccessToken()
            }
        });

        const newAccessToken = response.data.access_token;
        console.log("New Access Token:", newAccessToken);

        // Save the new token
        saveAccessToken(newAccessToken);

    } catch (error) {
        console.error("Error refreshing token:", error.response ? error.response.data : error.message);
    }
}

// Schedule token refresh daily at midnight
cron.schedule("0 0 * * *", () => {
    const lastRefresh = getLastRefreshTime();
    const now = Date.now();
    const fiftyFiveDays = 55 * 24 * 60 * 60 * 1000; // 55 days in milliseconds

    if (now - lastRefresh >= fiftyFiveDays) {
        console.log("🔄 Refreshing WhatsApp API Token...");
        refreshAccessToken();
    } else {
        console.log("Token refresh not needed yet.");
    }
});

// Initial token refresh on startup
refreshAccessToken();