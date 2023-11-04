require("dotenv").config();
const { makeReply } = require("./makeReply.js"); // 返信生成用の関数を読み込む
const { howToUseing } = require("./flexmessages/howToUse.js"); // 返信生成用の関数を読み込む
const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.EXPRESS_PORT;
const { getUserIdList, insertUserId } = require("./database.js");

// env呼び出し
const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
};

// インスタンス生成
const app = express();
const client = new line.Client(config);

// ExpressアプリケーションのPOSTルート "/webhook" に対するハンドラ関数
app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);

  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

// イベントの処理　今はテキストにのみ反応
async function handleEvent(event) {
  // メッセージにのみ返信 followではフレックスメッセージを送信
  if (event.type === "message" && event.message.type === "text") {
    // メッセージイベントの処理
    mes = await makeReply(event);
  } else if (event.type === "follow") {
    // "follow" イベントの処理
    const userId = event.source.userId; // LINEのユーザーID
    await insertUserId(userId);
    mes = {
      type: "flex",
      altText: "使い方はこちら！🙂",
      contents: howToUseing(),
    }; // howToUseing() 関数を呼び出す
  } else {
    return Promise.resolve(null);
  }

  // メッセージが空の場合は返信無し
  if (mes == null) {
    return Promise.resolve(null);
  }

  // 返信
  return client.replyMessage(event.replyToken, mes);
}

// 指定のポートで起動
app.listen(PORT);
// console.log(`Server running at ${PORT}`);

// 定期実行
const cron = require("node-cron");
//朝9時に実行
cron.schedule("0 0 9 * * *", () => {
  postMessage();
});

// //'秒 分 時 日 月 曜日' Debug用1分に1回実行
// cron.schedule('1 * * * * *', () => {
//     postMessage();
// });

const { selectJanalMode } = require("./flexmessages/selectJanalMode.js");
async function postMessage() {
  const userIdList = await getUserIdList();
  const messages = [
    {
      type: "text",
      text: "おはようございます！🌞\n今日もジャーナルで自分の考えを整理しましょう！",
    },
    {
      type: "flex",
      altText: "ジャーナルサポート",
      contents: selectJanalMode(),
    },
  ];
  userIdList.map(async (userId) => {
    try {
      const res = await client.pushMessage(userId, messages);
    } catch (error) {
      console.log(`エラー: ${error}`);
    }
  });
}
