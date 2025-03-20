
import axios from 'axios';


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

export {getPageDetails};