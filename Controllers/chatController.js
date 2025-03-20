import cleverbot from "cleverbot-free";

export const sendChatResponse = async (req, res) => {
  const { message } = req.body;
  const response = await cleverbot(message);

  res.json({
    response: message.includes("Hello") ? "In the Loop" : response,
  });
};
