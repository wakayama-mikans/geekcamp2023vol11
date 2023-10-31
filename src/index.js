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
  // 型はlistぽい

  // words = await getAnalyzedWord("みなりかけるは天才だ！")
  words = await getAnalyzedWord(getDataResult.join("."))
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((error) => {
      console.error(error);
    }); // analysiswords.jsのanalyzeWords関数を呼び出す

  // console.log(words.result.tokens);
  words = words.result.tokens; // 形態素解析の結果を取得
  let myDictionary = {}; // 単語の辞書
  for (var i = 0; i < words.length; i++) {
    // console.log(words[i][3]);
    if (words[i][3] == "名詞" || words[i][3] == "動詞" || words[i][3] == "形容詞") { // 品詞でフィルタリング
      // console.log(words[i][0]);
      if (myDictionary[words[i][0]] == null) { // 単語が初登場なら辞書に追加
        myDictionary[words[i][0]] = 1;
      } else {
        myDictionary[words[i][0]] += 1;
      }
    }
  }
  // console.log("=========================================================================");
  // console.log(myDictionary);
  // console.log("=========================================================================");

  var outputArray = [];
  for (var key in myDictionary) {
    if (myDictionary.hasOwnProperty(key)) {
      var newItem = {
        word: key,
        count: myDictionary[key],
      };
      outputArray.push(newItem);
    }
  }
  console.log(JSON.stringify(outputArray)); // JSON形式で出力（D3-cloudに必要な形式）


  return client.replyMessage(event.replyToken, mes); // オウム返し
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);