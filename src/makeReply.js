const { insertData, getLatestTopic, getTextByDate } = require("./database.js"); // データベース関連の関数をdatabase.jsから読み込む
const { otherOpinions } = require("./flexmessages/otherOpinions.js");
const {
  askToContinue,
  askViewResult,
} = require("./flexmessages/userInteraction.js");
const { choiceSpan } = require("./flexmessages/viewWordcloud.js");
const { getWordCloud } = require("./createWordCloud.js");
const { howToUseing } = require("./flexmessages/howToUse.js");
const { selectJanalMode } = require("./flexmessages/selectJanalMode.js");
const { client } = require("./lineClient.js");

// ユーザーごとの状態を管理するオブジェクト
const userStates = {};
const userTimeouts = {};

// const TIMEOUT = 1000 * 10; // 10秒(Debug)
const TIMEOUT = 1000 * 60 * 5; // 5分

async function makeReply(event) {
  const userId = event.source.userId; // LINEのユーザーID
  const text = event.message.text; // ユーザーが送信したテキスト
  let mes = [];

  // タイムアウトタイマー
  timeOutTimer(userId);

  if (text === "ジャーナルサポート") {
    mes = {
      type: "flex",
      altText: "ジャーナルサポート",
      contents: selectJanalMode(),
    };
  } else if (text === "未来について") {
    // ジャーナルの支援をリクエストした場合、状態を初期化
    userStates[userId] = "start";
    // メッセージリストからランダムに1つを選択
    const initialMessages = [
      "将来は何になりたいですか？",
      "何かしてみたいことはありますか？",
    ];
    const randomIndex = Math.floor(Math.random() * initialMessages.length);
    const responseMessages = [
      "ジャーナルの支援を開始します",
      initialMessages[randomIndex],
    ];
    // ユーザーに複数のメッセージを送信
    mes = responseMessages.map((text) => ({ type: "text", text }));
  } else if (text === "今日について") {
    userStates[userId] = "dailyAchievements";
    // 1日の振り返り開始
    const responseMessages = [
      "1日の振り返りを始めます！",
      "今日、実行できたことを挙げてみよう😊",
    ];
    // ユーザーに複数のメッセージを送信
    mes = responseMessages.map((text) => ({ type: "text", text }));
  } else if (text === "使い方を教えて！") {
    // 期間選択フレックスメッセージの送信
    mes = {
      type: "flex",
      altText: "使い方はこちら！🙂",
      contents: howToUseing(),
    };
  } else if (text === "結果がみたい") {
    // 期間選択フレックスメッセージの送信
    mes = {
      type: "flex",
      altText: "結果を見てみよう！😎",
      contents: choiceSpan(),
    };
  } else if (
    text === "1日の結果を見せて！" ||
    text === "1週間の結果を見せて！" ||
    text === "1ヶ月の結果を見せて！"
  ) {
    //WordCloud生成
    if (text === "1日の結果を見せて！") {
      date = 1;
    } else if (text === "1週間の結果を見せて！") {
      date = 7;
    } else if (text === "1ヶ月の結果を見せて！") {
      date = 30;
    }
    mes = await makeWordCloudReplyMessage(userId, date);
    userStates[userId] = "Not supported";
  } else if (text === "自由につぶやく") {
    //フリーモード開始時の返答
    const freeModeMassages = [
      "思ったことや，やりたいことを自由につぶやいてね✌️",
    ];
    mes = freeModeMassages.map((text) => ({ type: "text", text }));
    userStates[userId] = "freeMode";

  } else {
    if (text !== "はい" && text !== "いいえ" && userStates[userId]) {
      // id, status, textをDBに格納
      insertData(userId, userStates[userId], text);
    }

    // ステータスに応じて挙動を決める
    switch (userStates[userId]) {
      case "start":
        // 最初のやり取り
        if (text === "いいえ") {
          // const finishMassages = [
          //   "サポートはこれにて終了です！",
          //   "お疲れさまでした！🫠",
          // ];
          // mes = finishMassages.map((text) => ({ type: "text", text }));
          // userStates[userId] = "exception"; // statusを"exception"として設定
          // console.log("exceptionに変更");
          const finishMassages = [
            "お疲れ様でした！",
            "最後に、1日の結果を見てみますか？",
          ];
          mes = finishMassages.map((text) => ({ type: "text", text }));
          const flexmessage = {
            type: "flex",
            altText: "1日の結果を見てみる？🥺",
            contents: askViewResult(),
          };
          mes.push(flexmessage);
          userStates[userId] = "askViewResult";
          console.log("askViewResultに変更");
        } else {
          const initialMessages = ["もっと具体的に言うと？"];
          const randomIndex = Math.floor(
            Math.random() * initialMessages.length
          );
          mes = { type: "text", text: initialMessages[randomIndex] };
          userStates[userId] = "topic"; // statusを"topic"として設定
          console.log("topicに変更");
        }
        break;

      case "topic":
        // 2回目以降のやり取り
        const topicMessages = [
          "どうしてそう考えたの？🤔",
          "そのためにはどうすればいいかな？🤔",
        ];
        const randomIndexTopic = Math.floor(
          Math.random() * topicMessages.length
        );
        mes = { type: "text", text: topicMessages[randomIndexTopic] };
        if (randomIndexTopic === 0) {
          userStates[userId] = "why";
          console.log("whyに変更");
        } else {
          userStates[userId] = "how";
          console.log("howに変更");
        }
        // userStates[userId].lastMessage = topicMessages[randomIndexTopic];
        break;

      case "why":
        // 3回目のやり取り 3つの質問から使ってないものを選択
        const whyMessages = [
          "そのためにはどうすればいいかな？🤔",
          "他の選択肢はある？",
        ];
        // const remainingMessagesWhy = whyMessages.filter(message => message !== userStates[userId].lastMessage);
        // 残りのメッセージからランダムに選択
        const randomIndexWhy = Math.floor(Math.random() * whyMessages.length);
        if (randomIndexWhy === 0) {
          mes = { type: "text", text: whyMessages[randomIndexWhy] };
          userStates[userId] = "askViewResult";
          console.log("askViewResultに変更");
        } else {
          const latestTopic = await getLatestTopic(userId);
          console.log(latestTopic);
          mes = {
            type: "flex",
            altText: "他の選択肢について考えてみよう！😎",
            contents: otherOpinions(latestTopic),
          };
          userStates[userId] = "start";
          console.log("startに変更");
        }
        break;

      case "how":
        // 3回目のやり取り 3つの質問から使ってないものを選択
        const howMessages = [
          "どうしてそう考えたの？😗",
          "他の選択肢はある？😗",
        ];
        // const remainingMessagesHow = howMessages.filter(message => message !== userStates[userId].lastMessage);
        // 残りのメッセージからランダムに選択
        const randomIndexHow = Math.floor(Math.random() * howMessages.length);
        if (randomIndexHow === 0) {
          mes = { type: "text", text: howMessages[randomIndexHow] };
          userStates[userId] = "askViewResult";
          console.log("askViewResultに変更");
        } else {
          const latestTopic = await getLatestTopic(userId);
          console.log(latestTopic);
          mes = {
            type: "flex",
            altText: "他の選択肢について考えてみよう！😎",
            contents: otherOpinions(latestTopic),
          };
          userStates[userId] = "start";
          console.log("startに変更");
        }
        break;

      case "dailyAchievements":
        if (text === "はい") {
          mes = { type: "text", text: "じゃあ、他にできたことを教えて！🙂" };
          console.log("statusはdailyAchievementsのまま");
        } else if (text === "いいえ") {
          const nextMassages = [
            "よく頑張ったね！",
            "じゃあ次は、今日できなかったことについて教えて！🤔",
          ];
          mes = nextMassages.map((text) => ({ type: "text", text }));
          userStates[userId] = "dailyRegrets";
          console.log("dailyRegretsに変更");
        } else {
          mes = {
            type: "flex",
            altText: "他にもありそう？🤔",
            contents: askToContinue(),
          };
          console.log("statusはdailyAchievementsのまま");
        }
        break;

      case "dailyRegrets":
        if (text === "はい") {
          mes = {
            type: "text",
            text: "じゃあ、他にできなかったことを教えて！😗",
          };
          console.log("statusはdailyRegretsのまま");
        } else if (text === "いいえ") {
          const nextMassages = [
            "お疲れさま！",
            "1日の出来事についてまとめられたね",
            "次は、そこから得られた気付きや学びを挙げてみよう😊",
          ];
          mes = nextMassages.map((text) => ({ type: "text", text }));
          userStates[userId] = "dailyNotice";
          console.log("dailyNoticeに変更");
        } else {
          mes = {
            type: "flex",
            altText: "他にもありそう？🤔",
            contents: askToContinue(),
          };
          console.log("statusはdailyRegretsのまま");
        }
        break;

      case "dailyNotice":
        if (text === "はい") {
          mes = { type: "text", text: "じゃあ、他に気付いたことを教えて！🙂" };
          console.log("statusはdailyNoticeのまま");
        } else if (text === "いいえ") {
          const nextMassages = [
            "なるほどなるほど...",
            "じゃあ最後に、それらを踏まえてこれからしたいことも書いてみよう😉",
          ];
          mes = nextMassages.map((text) => ({ type: "text", text }));
          userStates[userId] = "dailyFuture";
          console.log("dailyFutureに変更");
        } else {
          mes = {
            type: "flex",
            altText: "他にもありそう？🤔",
            contents: askToContinue(),
          };
          console.log("statusはdailyNoticeのまま");
        }
        break;

      case "dailyFuture":
        if (text === "はい") {
          mes = { type: "text", text: "じゃあ、他にやりたいことを教えて！😗" };
          console.log("statusはdailyFutureのまま");
        } else if (text === "いいえ") {
          const finishMassages = [
            "お疲れ様でした！",
            "最後に、1日の結果を見てみますか？",
          ];
          mes = finishMassages.map((text) => ({ type: "text", text }));
          const flexmessage = {
            type: "flex",
            altText: "1日の結果を見てみる？🥺",
            contents: askViewResult(),
          };
          mes.push(flexmessage);
          userStates[userId] = "askViewResult";
          console.log("askViewResultに変更");
        } else {
          mes = {
            type: "flex",
            altText: "他にもありそう？🤔",
            contents: askToContinue(),
          };
          console.log("statusはdailyFutureのまま");
        }
        break;

      case "askViewResult":
        if (text === "はい") {
          // 1日分のワードクラウドを作成
          mes = await makeWordCloudReplyMessage(userId, 1);
          userStates[userId] = "Not supported";
          console.log("Not supportedに変更");
        } else if (text === "いいえ") {
          const finishMassages = [
            "了解しました！",
            "それでは、サポートはこれにて終了です",
            "また利用してくださいね🫡",
          ];
          mes = finishMassages.map((text) => ({ type: "text", text }));
          userStates[userId] = "Not supported";
          console.log("Not supportedに変更");
        } else {
          const finishMassages = [
            "お疲れ様でした！",
            "最後に、1日の結果を見てみますか？",
          ];
          mes = finishMassages.map((text) => ({ type: "text", text }));
          const flexmessage = {
            type: "flex",
            altText: "1日の結果を見てみる？🥺",
            contents: askViewResult(),
          };
          mes.push(flexmessage);
          console.log("statusはaskViewResultのまま");
        }
        break;
      case "freeMode":
        //相槌を返す
        mes = getAgreementMessages()
        break;
      case "finish":
        const finishMassages = [
          "お疲れ様でした！",
          "サポートはこれにて終了です",
          "また利用してくださいね🫡",
        ];
        mes = finishMassages.map((text) => ({ type: "text", text }));
        // addMessage = { type: "flex", altText: "他にもありそう？🤔", contents: askToContinue() };
        // mes.push(addMessage);
        // const latestTopic = await getLatestTopic(userId);
        // console.log(latestTopic);
        // mes = { type: "flex", altText: "他の選択肢について考えてみよう！😎", contents: otherOpinions(latestTopic) };
        // console.log("nullを返信");
        break;

      default:
        mes = null;
        userStates[userId] = "Not supported";
        insertData(userId, userStates[userId], text);
    }
  }

  console.log(userStates[userId]);
  return mes;
}

async function makeWordCloudReplyMessage(userId, date) {
  //TODO:画像生成失敗した時のERRメッセージ
  //TODO:画像生成するためのメッセージが足りない
  const res = await getWordCloud(userId, date);
  // const mes = [];
  if ("result" in res) {
    const finishMassages = [
      date + "日分の結果がこれです！",
      "また利用してくださいね🫡",
    ];
    mes = finishMassages.map((text) => ({ type: "text", text }));

    const wordCloudURL = res.result.url;
    const sentimentType = res.result.sentimentType;
    const sentimentScore = res.result.sentimentScore;
    mes.push({
      type: "image",
      originalContentUrl: wordCloudURL[0],
      previewImageUrl: wordCloudURL[0],
    });
    mes.push(getSentimentText(sentimentType, sentimentScore));
  } else {
    //TODO:0の時，n個以下のとき？
    mes = [{ type: "text", text: "もっとジャーナリングしてみよう" }];
  }
  console.log(mes);
  return mes;
}

function getSentimentText(sentimentType, sentimentScore) {
  if (sentimentType === "Positive") {
    if (sentimentScore > 0.6) {
      message = "君は絶好調だね🤩";
    } else if (sentimentScore > 0.5) {
      message = "ハッピーな言葉が多いね🤗";
    } else if (sentimentScore > 0.4) {
      message = "とっても楽しそうな頭の中だね😝";
    } else {
      message = "わくわくするようなことが書かれているね😊";
    }
  } else if (sentimentType === "Negative") {
    if (sentimentScore > 0.5) {
      message = "ポジティブな発言が多いと頭の中が明るくなるよ！🥰";
    } else {
      message = "楽しくなるようなつぶやきもしてみよう！😝";
    }
  } else {
    message = "穏やかな気持ちで過ごせたね！😊";
  }
  return { type: "text", text: message };
}

async function postTimeOutMessage(userId) {
  const message = { type: "text", text: "ジャーナルサポートを終了します🫡" };
  try {
    const res = await client.pushMessage(userId, message);
  } catch (error) {
    console.log(`エラー: ${error}`);
  }
}

function timeOutTimer(userId) {
  if (userTimeouts[userId]) {
    clearTimeout(userTimeouts[userId]);
    delete userTimeouts[userId];
  }
  startTimeoutTimer(userId, TIMEOUT);
}

async function startTimeoutTimer(userId, timeoutInSeconds) {
  const timeoutId = setTimeout(async () => {
    // タイムアウト時の処理をここに記述
    const status = userStates[userId];
    if (status !== "Not supported" && status != undefined && status != null) {
      // ジャーナルサポート中のタイムアウト
      await postTimeOutMessage(userId);
    }
    userStates[userId] = "Not supported";
    delete userTimeouts[userId];
  }, timeoutInSeconds); // timeoutInSecondsは秒単位の時間

  // タイムアウトIDをユーザーごとに保存
  userTimeouts[userId] = timeoutId;
}

function getAgreementMessages(){
  const agreementMessages = [
    "そうなんだ！😊",
    "なるほど...🤔",
    "うんうん🙂",
    "すごくいいね😄",
  ];
  const randomIndex = Math.floor(Math.random() * agreementMessages.length);
  return [{type:"text",text: agreementMessages[randomIndex]}];
}

function getRandomQuestion(){
  const questionMessages = [
    "最近嬉しかったことは？",
    "最近イライラことは？",
    "将来やってみたいことは？",
    "最近どんな新しい発見があった？",
    "やってみたい挑戦は？",
    "心配なことってなんだろう？",
    "君にとって幸せって何かな？",
    "一番熱中できることは？",
    "君のいいところを教えて！！",
    "君の改善したいところを教えて！！",
    "周りの人でどんな人にあこがれる？",
  ];
  const randomIndex = Math.floor(Math.random() * questionMessages.length);
  return [{type:"text",text: questionMessages[randomIndex]}];
}

module.exports = { makeReply };
