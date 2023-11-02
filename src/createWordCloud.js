const axios = require("axios");
const fastapiUrl = "http://fastapi:8888";
const fs = require("fs");
const { get } = require("http");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const {storage, bucket,getDownloadURL } = require("./firebase-config.js");
const inputData = {
  text: "田賀はじゃけじゃけうるさい広島人だ．広島といえばもんじゃ焼きだ．広島いきたいな．姫センはみんなでいったな．そういえばみなりん足はやかったな．みなりかけるは天才だ！かっこいい！スマート！バレーボール馬鹿！Python is a powerful programming language used for various applications. It is known for its simplicity and readability.",
};

// Create a reference to 'mountains.jpg'
// const mountainsRef = ref(storage, 'sample.png');

// // Create a reference to 'images/mountains.jpg'
// const mountainImagesRef = ref(storage, 'sample.png');

// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name;           // true
// mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 

getWordCloud("test",1);

async function getWordCloud(userId,date) {
    //TODO:listから文字列変換（頻度分析・感情分析・形態素解析）をどうやるかによって分かれそう
    // const textData = inputData;
    // const textData = await getTextByDate(userId, date);

    //バイナリデータの取得
    //TODO:たくみのとつなぎこみ バイナリーデータがもらえたらいい
    const binaryData = await getBinaryData();
    console.log("binaryData", binaryData)
    const fileName = userId + ".png";
    const file = bucket.file(fileName); // アップロードするファイルの名前を指定
    const tmp = await file.save(binaryData, {
        contentType: "image/png" // ファイルのコンテンツタイプを指定
    });

    const url = await bucket.file(fileName).getSignedUrl({            action: 'read',
        expires: '12-31-3020' //1000年後に設定
    }); 

    console.log("url!!!!!!!!!!!!!!!!!!!!!!!!!", url)

    //URLを返す
    // console.log("tmp", binaryData)
    return url;
}

async function getBinaryData() {
    try {
        const response = await axios.post(`${fastapiUrl}/test`, inputData);
        console.log(response);
        if (response.data && typeof response.data.image === "string") {
            // Base64エンコードされた文字列をデコードしてバイナリに変換
            const binaryData = Buffer.from(response.data.image, "base64");
            console.log("binaryData!!", binaryData);
            return binaryData;
        } else {
            console.error("Received data is not a valid Base64 encoded string");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

module.exports = { getWordCloud };