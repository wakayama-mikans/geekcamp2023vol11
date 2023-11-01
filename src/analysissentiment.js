const https = require("https");
require("dotenv").config(); // envファイル読み込み

// COTOHA APIにアクセスするためのトークンを取得するための関数
function getToken() {
  return new Promise((resolve, reject) => {
    const url = "https://api.ce-cotoha.com/v1/oauth/accesstokens";
    const json = {
      grantType: "client_credentials",
      clientId: process.env.COTOHA_CLIENT_ID,
      clientSecret: process.env.COTOHA_CLIENT_SECRET,
    };
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
    };

    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const access_token = JSON.parse(data).access_token;
          resolve(access_token);
        } catch (error) {
          reject(error);
        }
      });

      res.on("error", (error) => {
        reject(error);
      });
    });

    req.write(JSON.stringify(json));
    req.end();
  });
}

function analysisSentiment(text) {
  getToken("your_text_here")
    .then((access_token) => {
      // console.log(access_token);
      return new Promise((resolve, reject) => {
        const url = "https://api.ce-cotoha.com/api/dev/" + "nlp/v1/sentiment"; // 感情分析のエンドポイント
        const json = {
          sentence: text,
          type: "default",
        };
        const options = {
          method: "post",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          payload: JSON.stringify(json),
        };

        const req = https.request(url, options, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            console.log(data);
            sentiment = JSON.parse(data).result.sentiment;
            score = JSON.parse(data).result.score;
            console.log([sentiment, score]);
          });
        });

        req.write(JSON.stringify(json));
        req.end();
      });
    })
    .catch((error) => {
      console.error("エラーが発生しました: " + error);
    });
}

module.exports = { analysisSentiment };