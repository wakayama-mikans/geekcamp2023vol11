const axios = require("axios");
const fastApiUrl = "http://fastapi:8888";
const { bucket } = require("./firebase-config.js");
const { getTextByDate } = require("./database.js");

async function getWordCloud(userId, date) {
  //TODO:WordCloud生成の引数設定：listから文字列変換（頻度分析・感情分析・形態素解析）をどうやるかによって分かれそう
  const targetTextData = await getTextByDate(userId, date);
  //  ↓ targetTextDataからfastAPIに投げる形への成型が必要
  const sampleInput = {
    text: "田賀康平はじゃけじゃけうるさい広島人だ．広島といえばもんじゃ焼きだ．広島いきたいな．姫センはみんなでいったな．そういえばみなりん足はやかったな．みなりかけるは天才だ！かっこいい！スマート！バレーボール馬鹿！Python is a powerful programming language used for various applications. It is known for its simplicity and readability.",
  };

  //バイナリデータをPNG変換してFirebaseStorageに保存
  const binaryData = await getBinaryData(sampleInput);
  //TODO:画像の保存保存場所の検討 現状はUserID.pngを更新し続けている（A：ランダム生成，B：作成後に削除，C：ファイル更新（<-現状これ)
  const fileName = userId + ".png";
  const file = bucket.file(fileName); // アップロードするファイルの名前を指定
  await file.save(binaryData, {
    contentType: "image/png", // ファイルのコンテンツタイプを指定
  });

  const url = await bucket.file(fileName).getSignedUrl({
    action: "read",
    expires: "12-31-3020", //1000年後に設定
  });

  return url;
}

async function getBinaryData(inputData) {
  try {
    const response = await axios.post(`${fastApiUrl}/test`, inputData);
    if (response.data && typeof response.data.image === "string") {
      // Base64エンコードされた文字列をデコードしてバイナリに変換
      const binaryData = Buffer.from(response.data.image, "base64");
      return binaryData;
    } else {
      console.error("Received data is not a valid Base64 encoded string");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { getWordCloud };