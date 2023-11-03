// Firebase用の設定
const admin = require("firebase-admin");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage, getDownloadURL } = require("firebase-admin/storage");
const serviceAccount = require("../serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "gs://geekcamp2023vol11.appspot.com",
});

const bucket = admin.storage().bucket();
const db = getFirestore();
const storage = getStorage();

module.exports = { db, storage, bucket, getDownloadURL };