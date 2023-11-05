const { FieldValue } = require("firebase-admin/firestore");

// const db = getFirestore();
const { db } = require("./firebase-config.js");
const { async } = require("@firebase/util");

async function getData(userId) {
  const res = await db.collection(userId).get(); // ユーザひとりのドキュメントすべてを取得
  const data = res.docs.map((doc) => doc.data().text); // ドキュメントのtextフィールドのみを取得
  //   console.log("=========================================================================");
  //   console.log(data);
  //   console.log("=========================================================================");
  return data;
}

async function getLatestTopic(userId) {
  console.log("到達！");
  const res = await db
    .collection(userId)
    .where("status", "==", "topic") // "status" フィールドが "topic" の条件を追加
    .get();
  // const res = await db.collection(userId)
  //   .where("status", "==", "topic") // "status" フィールドが "topic" の条件を追加
  //   .orderBy("timestamp", "desc") // "timestamp" フィールドを降順でソート
  //   .limit(1) // 最新の1つだけを取得
  //   .get();

  if (!res.empty) {
    // ドキュメントが見つかった場合
    const reversedDocs = res.docs.slice().reverse();
    const lastDoc = reversedDocs[0];
    const latestText = lastDoc.data().text;
    return latestText;
  } else {
    // ドキュメントが見つからなかった場合
    return null;
  }
}

//n日前の日付を取得
async function getTextByDate(userId, date) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - date);

  console.log(currentDate);
  const res = await db
    .collection(userId)
    .where("timestamp", ">", currentDate)
    .get();

  if (!res.empty) {
    const data = res.docs.map((doc) => doc.data().text); // ドキュメントのtextフィールドのみを取得
    return data;
  } else {
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

async function insertUserId(userId){
  const data = {
    userid: userId,
  }; // FirebaseのDBに追加

  const res = await db
    .collection("userIdList")
    .doc(userId)
    .set(data);
}

async function getUserIdList(){
  const res = await db
    .collection("userIdList")
    .get();
  const data = res.docs.map((doc) => doc.data().userid); // ドキュメントのtextフィールドのみを取得
  return data;
}
async function getDocumentCount(userId) {

  console.log("getDocumentCount");
  try {
    const querySnapshot = await db.collection(userId).get(); // "status" フィールドが "topic" の条件を追加

    const documentCount = querySnapshot.size;
    return documentCount;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return -1; // エラー時に-1を返す
  }
}


module.exports = { insertData, getData, getLatestTopic, getTextByDate, insertUserId, getUserIdList, getDocumentCount};

