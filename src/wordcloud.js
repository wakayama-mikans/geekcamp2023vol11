const wordcloud_json = [
  { word: "今日", count: 3 },
  { word: "晴れ", count: 1 },
  { word: "領域", count: 1 },
  { word: "展開", count: 1 },
  { word: "怖い", count: 1 },
  { word: "ねむたい", count: 1 },
  { word: "交流", count: 2 },
  { word: "会", count: 2 },
  { word: "あり", count: 2 },
  { word: "開発", count: 2 },
  { word: "楽しい", count: 2 },
  { word: "寿司", count: 1 },
  { word: "食べ", count: 2 },
  { word: "ラーメン", count: 1 },
  { word: "花見", count: 1 },
  { word: "し", count: 1 },
  { word: "富士山", count: 1 },
  { word: "見て", count: 1 },
];
// これでJSON形式を宣言できているか不明．多分似た形式になってるだけで宣言できてないっぽい．
// wordcloudにはこの形式でデータを渡す必要がある．

const https = require("https");

// COTOHA APIにアクセスするためのトークンを取得するための関数
function getToken() {
  const url = "https://api.ce-cotoha.com/v1/oauth/accesstokens";
  const json = {
    grantType: "client_credentials",
    clientId: "3e849JKUbp8eDYYCUjU79DnnhrQLlBVA",
    clientSecret: "xakNvgvjVwR0WQEl",
  };
  const options = {
    method: "post",
    headers: { "Content-type": "application/json" },
  };

  const req = https.request(url, options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      // リクエストが完了したらデータを処理するコードをここに書きます
      console.log(data);
      console.log("=============");
    });
  });

  req.write(JSON.stringify(json));
  req.end();
} // ここまでは動作確認済み

getToken();