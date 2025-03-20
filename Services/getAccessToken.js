import fs from "fs"

const TOKEN_FILE_PATH = "./whatsapp_token.json";

function getAccessToken() {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
        const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, "utf-8"));
        console.log(tokenData.access_token)
        return tokenData.access_token;
        
    } else {
        console.error("❌ ERROR: Token file not found!");
        return null;
    }
}

export { getAccessToken };