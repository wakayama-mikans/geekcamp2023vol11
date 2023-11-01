const { insertData , getData } = require("./database.js"); // データベース関連の関数をdatabase.jsから読み込む

// ユーザーごとの状態を管理するオブジェクト
const userStates = {};

function makeReply (event) {
  const userId = event.source.userId; // LINEのユーザーID
  const text = event.message.text; // ユーザーが送信したテキスト
  userStates[userId] = "finish";
  let mes;

  if (text === "ジャーナルの支援をしてください") {
    // ジャーナルの支援をリクエストした場合、状態を初期化
    userStates[userId] = "initial";

    // "将来は何になりたいですか？" と "今してみたいことは何ですか？" からランダムに1つを選択
    const initialMessages = ["将来は何になりたいですか？", "今してみたいことは何ですか？"];
    const randomIndex = Math.floor(Math.random() * initialMessages.length);
    const responseMessages = [
      "ジャーナルの支援を開始します",
      initialMessages[randomIndex]
    ];
    // ユーザーに複数のメッセージを送信
    mes = responseMessages.map(text => ({ type: "text", text }));
  } else if (text === "支援を終了します") {
    // 支援を終了した場合、状態を初期化
    userStates[userId] = "finish";
    mes = { type: "text", text: "支援を終了しました" };
  } else {
    insertData(userId, text); // database.jsのgetData関数を呼び出す

    if (userStates[userId] === "initial") {
      // 最初のやり取り
      const initialMessages = ["それはどうして？", "その方法は？"];
      const randomIndex = Math.floor(Math.random() * initialMessages.length);
      mes = { type: "text", text: initialMessages[randomIndex] };
      userStates[userId] = "follow"; // その後のやり取り状態に移行
      console.log("followに変更");
    } else if(userStates[userId] === "follow") {
      // 二回目以降のやり取り
      const followupMessages = ["それはどうして？", "その方法は？", "他の選択肢はある？"];
      const randomIndex = Math.floor(Math.random() * followupMessages.length);
      mes = { type: "text", text: followupMessages[randomIndex] };
      userStates[userId] = "finish";
      console.log("finishに変更");
    } else if (userStates[userId] === "finish"){
      mes = null;
      console.log("nullを返信")
    } else {
      mes = null;
    }
  }

  console.log(userStates[userId])
  return mes;
}

module.exports = { makeReply };