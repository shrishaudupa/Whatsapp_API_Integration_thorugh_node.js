import axios from "axios";

export const getPageDetails = async () => {
  const FORM_ID = "your_actual_form_id"; // Replace with a valid form ID
  const url = `https://graph.facebook.com/v12.0/${FORM_ID}/leads?access_token=${process.env.ACCESS_TOKEN}`;

  try {
    const response = await axios.get(url);
    console.log("✅ Fetched Leads:", response.data);
  } catch (error) {
    console.error("❌ Error fetching user data:", error.response?.data || error.message);
  }
};

