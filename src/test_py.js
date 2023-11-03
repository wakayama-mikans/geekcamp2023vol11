const axios = require("axios");
const fastapiUrl = "http://fastapi:8888";
const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

const inputData = {
//   text: "Python is a powerful programming language used for various applications. It is known for its simplicity and readability.",
  text: "田賀はじゃけじゃけうるさい広島人だ．広島といえばもんじゃ焼きだ．広島いきたいな．姫センはみんなでいったな．そういえばみなりん足はやかったな．みなりかけるは天才だ！かっこいい！スマート！バレーボール馬鹿！Python is a powerful programming language used for various applications. It is known for its simplicity and readability.",
};

async function test_post() {
  try {
    axios.post(`${fastapiUrl}/test`, inputData).then((response) => {
        // console.log("Processed Text:", response.data.image);
        
        if (response.data && typeof response.data.image === "string") {
            // Base64エンコードされた文字列をデコードしてバイナリに変換
            const binaryData = Buffer.from(response.data.image, "base64");
            writeFile("savedImage.png", binaryData); // awaitいるかも？
            console.log("Image saved successfully");
            //送信処理
            console.log(binaryData)
            return binaryData;
        } else {
            console.error("Received data is not a valid Base64 encoded string");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        // console.log("エラー");
    });
    } catch (error) {
        console.error("Error sending GET request to FastAPI:", error.message);
    }
}

// // FastAPIにGETリクエストを送信してBase64エンコードされた文字列を受け取り、バイナリに変換して保存
// async function sendGetRequest() {
//   try {
//     const response = await axios.get(`${fastapiUrl}/`);
//     console.log(response.data);
//     console.log(typeof response.data.image);

//     if (response.data && typeof response.data.image === "string") {
//       // Base64エンコードされた文字列をデコードしてバイナリに変換
//       console.log("aaa");
//       const binaryData = Buffer.from(response.data.image, "base64");
//       await writeFile("savedImage.png", binaryData);

//       console.log("Image saved successfully");
//     } else {
//       console.error("Received data is not a valid Base64 encoded string");
//     }
//   } catch (error) {
//     console.error("Error sending GET request to FastAPI:", error.message);
//   }
// }

// sendGetRequest();
test_post()