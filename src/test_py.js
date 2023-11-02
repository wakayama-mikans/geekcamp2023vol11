const axios = require("axios");
const fastapiUrl = "http://fastapi:8888"; // FastAPIコンテナのホスト名とポート

const fs = require("fs");

// FastAPIにGETリクエストを送信する関数
async function sendGetRequest() {
  try {
    // const response = await axios.get(`${fastapiUrl}/`);
    // console.log("Response from FastAPI:");
    // console.log(response.data);

    // const fs = require("fs");
    // fs.writeFileSync(`./nefry.png`,response.data, "binary");

    // FastAPIからバイナリデータを取得
    const response = await axios.get(`${fastapiUrl}/`, {
      responseType: "arraybuffer",
    });

    console.log(response.data);

    // バイナリデータを保存
    fs.writeFile("savedImage.png", response.data, "binary", (err) => {
      if (err) {
        console.error("Error saving the image:", err);
      } else {
        console.log("Image saved successfully");
      }
    });
  } catch (error) {
    console.error("Error sending GET request to FastAPI:", error.message);
  }
}

// GETリクエストを送信
sendGetRequest();
