require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.EXPRESS_PORT;

// Firebase用の設定
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter, serverTimestamp} = require('firebase-admin/firestore');

const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

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

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");
  const worldTimestamp = `${year}${month}${day}${hour}${minute}${second}`; // 世界標準時のタイムスタンプ
  const talkTimestamp = FieldValue.serverTimestamp(); // サーバー（Firestore側）のタイムスタンプ

  const data = {
    userid: userId,
    timestamp: talkTimestamp,
    text: event.message.text,
  }; // FirebaseのDBに追加
  const res = await db.collection(userId).doc(worldTimestamp.toString()).set(data);

  return client.replyMessage(event.replyToken, mes);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);