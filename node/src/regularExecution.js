const { selectJanalMode } = require("./flexmessages/selectJanalMode.js");
const { getUserIdList } = require("./database.js");

async function postMorningMessage(client) {
  const userIdList = await getUserIdList();
  const messages = [
    {
      type: "text",
      text: "おはようございます！🌞\n今日もジャーナルで自分の考えを整理しましょう！",
    },
    {
      type: "flex",
      altText: "ジャーナルサポート",
      contents: selectJanalMode(),
    },
  ];
  userIdList.map(async (userId) => {
    try {
      const res = await client.pushMessage(userId, messages);
    } catch (error) {
      console.log(`エラー: ${error}`);
    }
  });
}

module.exports = { postMorningMessage };
