require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.EXPRESS_PORT;
const {insertData,getData} = require("./database.js"); // データベース関連の関数をdatabase.jsから読み込む
const { getAnalyzedWord } = require("./analysiswords.js"); // 形態素解析関連の関数をanalysiswords.jsから読み込む

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

  const getDataResult = await getData(userId); // database.jsのgetData関数を呼び出す

  words = await getAnalyzedWord("みなりかけるは天才だ！")
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((error) => {
      console.error(error);
    }); // analysiswords.jsのanalyzeWords関数を呼び出す
  console.log(words.result.tokens);

  return client.replyMessage(event.replyToken, mes);
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);