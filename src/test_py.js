const axios = require("axios");
const fastapiUrl = "http://fastapi:8888";
const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

const { analysisSentiment } = require("./analysissentiment.js");
const { getTextByDate } = require("./database.js"); // データベース関連の関数をdatabase.jsから読み込む
const { getAnalyzedWord } = require("./analysiswords.js"); // 形態素解析関連の関数をanalysiswords.jsから読み込む

async function test_post(inputData) {
  try {
    axios
      .post(`${fastapiUrl}/test`, inputData)
      .then((response) => {
        if (response.data && typeof response.data.image === "string") {
          // Base64エンコードされた文字列をデコードしてバイナリに変換
          const binaryData = Buffer.from(response.data.image, "base64");
          writeFile("savedImage.png", binaryData); // awaitいるかも？
          console.log("Image saved successfully");
        } else {
          console.error("Received data is not a valid Base64 encoded string");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error sending GET request to FastAPI:", error.message);
  }
}

async function getSentiment(line_text) {
  const data = await analysisSentiment(line_text) // テキストを結合して感情分析APIに送信
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });

  //   console.log("===========");
  //   arr_tmp = [data.sentiment, data.score];
  //   console.log(arr_tmp[0]);
  //   console.log(arr_tmp[1]);
  //   console.log("===========");

  arr_tmp = data.sentiment; // ポジティブ，ネガティブ，ニュートラルのいずれか
//   console.log(arr_tmp);

  return arr_tmp;
}

async function getTextByFirebase(userId) {
  const arr_line_text = await getTextByDate(userId, 1); // Firebaseから指定期間分のテキストを取得
  line_text = arr_line_text.join(" ");
  // console.log(line_text);
  const arr_tmp = await getSentiment(line_text); // 感情分析APIに送信

  words = await getAnalyzedWord(line_text)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((error) => {
      console.error(error);
    }); // YahooAPIで形態素解析

  words = words.result.tokens; // 形態素解析の結果を取得

  let myDictionary = {}; // 単語の辞書
  for (var i = 0; i < words.length; i++) {
    if (
      words[i][3] == "名詞" ||
      words[i][3] == "動詞" ||
      words[i][3] == "形容詞"
    ) {
      // 品詞でフィルタリング
      if (myDictionary[words[i][0]] == null) {
        // 単語が初登場なら辞書に追加
        myDictionary[words[i][0]] = 1;
      } else {
        myDictionary[words[i][0]] += 1;
      }
    }
  }

  const inputData = {
    text: JSON.stringify(myDictionary),
    sentiment: arr_tmp,
  };

  // console.log(inputData);
  test_post(inputData);
}

const userId = "LINE_USER_ID"

getTextByFirebase(userId);
