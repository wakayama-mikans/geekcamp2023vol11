require("dotenv").config();
const https = require("https");
const APPID = process.env.YAHOO_CLIENT_ID;
const URL = "https://jlp.yahooapis.jp/MAService/V2/parse";

async function getAnalyzedWord(query) {
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": `Yahoo AppID: ${APPID}`,
  };

  const param_dic = {
    id: "1234-1",
    jsonrpc: "2.0",
    method: "jlp.maservice.parse",
    params: {
      q: query,
    },
  };

  const params = JSON.stringify(param_dic);

  const options = {
    method: "POST",
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(URL, options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve(body);
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
}

module.exports = { getAnalyzedWord };