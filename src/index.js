require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.EXPRESS_PORT;

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);

  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  let mes = { type: "text", text: event.message.text };
  return client.replyMessage(event.replyToken, mes);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);