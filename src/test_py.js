const axios = require("axios");
const fastapiUrl = "http://fastapi:8888";
const fs = require("fs");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

// FastAPIにGETリクエストを送信してBase64エンコードされた文字列を受け取り、バイナリに変換して保存
async function sendGetRequest() {
  try {
    const response = await axios.get(`${fastapiUrl}/`);
    console.log(response.data);
    console.log(typeof response.data.image);
    
    if (response.data && typeof response.data.image === "string") {
      // Base64エンコードされた文字列をデコードしてバイナリに変換
      console.log("aaa");
      const binaryData = Buffer.from(response.data.image, "base64");
      await writeFile("savedImage.png", binaryData);

      console.log("Image saved successfully");
    } else {
      console.error("Received data is not a valid Base64 encoded string");
    }
  } catch (error) {
    console.error("Error sending GET request to FastAPI:", error.message);
  }
}

sendGetRequest();
