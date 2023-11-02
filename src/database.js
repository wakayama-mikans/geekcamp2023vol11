// Firebase用の設定
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
  serverTimestamp,
} = require("firebase-admin/firestore");
const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function getData(userId) {
  const res = await db.collection(userId).get(); // ユーザひとりのドキュメントすべてを取得
  const data = res.docs.map((doc) => doc.data().text); // ドキュメントのtextフィールドのみを取得
  //   console.log("=========================================================================");
  //   console.log(data);
  //   console.log("=========================================================================");
  return data;
}

async function getLatestTopic(userId) {
  console.log("到達！")
  const res = await db.collection(userId)
    .where("status", "==", "topic") // "status" フィールドが "topic" の条件を追加
    .get();
  // const res = await db.collection(userId)
  //   .where("status", "==", "topic") // "status" フィールドが "topic" の条件を追加
  //   .orderBy("timestamp", "desc") // "timestamp" フィールドを降順でソート
  //   .limit(1) // 最新の1つだけを取得
  //   .get();
  
    console.log(res)

  if (!res.empty) {
    // ドキュメントが見つかった場合
    const latestDoc = res.docs[0];
    const latestText = latestDoc.data().text;
    return latestText;
  } else {
    // ドキュメントが見つからなかった場合
    return null;
  }
}


// FirebaseのDBにデータを追加する関数
async function insertData(userId, talkStatus, text) {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");
  const worldTimestamp = `${year}${month}${day}${hour}${minute}${second}`; // 世界標準時のタイムスタンプ
  const talkTimestamp = FieldValue.serverTimestamp(); // サーバー（Firestore側）のタイムスタンプ

  const data = {
    userid: userId,
    timestamp: talkTimestamp,
    status: talkStatus,
    text: text,
  }; // FirebaseのDBに追加

  const res = await db
    .collection(userId)
    .doc(worldTimestamp.toString())
    .set(data);
}

module.exports = { insertData, getData, getLatestTopic };
