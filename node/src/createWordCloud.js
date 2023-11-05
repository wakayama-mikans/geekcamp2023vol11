const axios = require("axios");
const { bucket } = require("./firebase-config.js");
const { getTextByDate } = require("./database.js");
const { analysisSentiment } = require("./analysissentiment.js"); // 感情分析API
const { getAnalyzedWord } = require("./analysiswords.js"); // 形態素解析API
const { getStopWords } = require("./stopwords.js"); // ストップワード取得API

const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

async function getWordCloud(userId, date) {
  const targetTextData = await getTextByDate(userId, date);
  // console.log(targetTextData);
  // console.log(targetTextData.length);
  if (targetTextData && targetTextData.length > 0) {
    const len_text = targetTextData.length; // 取得したテキストの数
  } else {
    return { err: "NoText" };
  }
  const line_text = targetTextData.join(" "); // 取得したテキストを1文章に結合
  const arr_tmp = await getSentiment(line_text); // 感情分析APIに送信

  const sentimentType = arr_tmp[0];
  const sentimentScore = arr_tmp[1];

  // YahooAPIで形態素解析
  words = await getAnalyzedWord(line_text)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((error) => {
      console.error(error);
    });
  words = words.result.tokens; // 形態素解析の結果

  let myDictionary = {}; // 単語の辞書

  // ストップワードを取得
  const stopWords = getStopWords();

  // 品詞でフィルタリング
  for (var i = 0; i < words.length; i++) {
    if (
      words[i][3] == "名詞" ||
      words[i][3] == "動詞" ||
      words[i][3] == "形容詞"
    ) {
      // ストップワードを除外
      if (stopWords.includes(words[i][0]) == false) {
        // 単語が初登場なら辞書に追加
        if (myDictionary[words[i][0]] == null) {
          myDictionary[words[i][0]] = 1;
        } else {
          myDictionary[words[i][0]] += 1;
        }
      }
    }
  }

  // FastAPIに送信するデータ
  const inputData = {
    text: myDictionary,
    sentiment: arr_tmp[0],
    score: arr_tmp[1],
  };

  //WordCLoud生成
  const binaryData = await getBinaryData(inputData);
  //Storage保存
  const url = await storeWordCloud(userId, binaryData);

  return { result: { url, sentimentType, sentimentScore } };
}

async function storeWordCloud(userId, binaryData) {
  //ファイルの削除
  const files = await bucket.getFiles({
    startOffset: `wordClouds/${userId}/`,
  });
  for (const item of files[0]) {
    await bucket.file(item.name).delete();
  }

  //ファイルの保存
  const now = new Date();
  const nowStr =
    "" +
    now.getFullYear() +
    (now.getMonth() + 1) +
    now.getDate() +
    now.getHours() +
    now.getMinutes() +
    now.getSeconds();
  const fileName = nowStr + ".png";
  const filePath = "wordClouds/" + userId + "/" + fileName;
  const file = bucket.file(filePath);
  await file.save(binaryData, {
    contentType: "image/png", // ファイルのコンテンツタイプを指定
  });

  const url = await bucket.file(filePath).getSignedUrl({
    action: "read",
    expires: "12-31-3020", //1000年後に設定
  });

  return url;
}

async function getBinaryData(inputData) {
  try {
    const response = await axios.post(`${process.env.GOOGLE_FUNCTIONS_URL}`, inputData);
    if (response.data && typeof response.data.image === "string") {
      // Base64エンコードされた文字列をデコードしてバイナリに変換
      const binaryData = Buffer.from(response.data.image, "base64");

      // writeFile("savedImage.png", binaryData);
      // console.log("Image saved successfully");

      return binaryData;
    } else {
      console.error("Received data is not a valid Base64 encoded string");
    }
  } catch (error) {
    console.error("Error:", error);
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

  arr_tmp = data.sentiment; // ポジティブ，ネガティブ，ニュートラルのいずれか
  // console.log("arr_tmp", arr_tmp);
  score = data.score;
  // console.log("score", score);

  return [arr_tmp, score];
}

module.exports = { getWordCloud };
