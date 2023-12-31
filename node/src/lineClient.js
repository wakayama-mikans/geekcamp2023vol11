const line = require("@line/bot-sdk");

// env呼び出し
const config = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
};

// インスタンス生成
const client = new line.Client(config);

module.exports = {line, config, client };