require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.EXPRESS_PORT;
const insertData = require("./database.js"); // データベース関連の関数をdatabase.jsから読み込む

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
  const userId = event.source.userId; // LINEのユーザーID
  const text = event.message.text; // ユーザーが送信したテキスト

  insertData(userId,text); // database.jsのgetData関数を呼び出す

  return client.replyMessage(event.replyToken, mes);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);