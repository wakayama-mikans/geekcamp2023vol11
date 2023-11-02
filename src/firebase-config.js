// Firebase用の設定
const admin = require('firebase-admin');

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
  const { getStorage, getDownloadURL } = require("firebase-admin/storage");

  const serviceAccount = require("../serviceAccountKey.json");
  
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'gs://geekcamp2023vol11.appspot.com'
  });
  
  const bucket = admin.storage().bucket();
  const db = getFirestore();
  const storage = getStorage();
  const ref = storage.ref


module.exports = { db ,storage, bucket, getDownloadURL};