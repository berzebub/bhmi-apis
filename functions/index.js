const functions = require("firebase-functions");
const express = require("express");
const app = express();
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.collection("CESD_Accounts")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((doc) => {
      if (doc.size) {
        const uid = doc.docs[0].id;
        admin
          .auth()
          .createCustomToken(uid)
          .then((customToken) => {
            res.send(customToken);
          });
      } else {
        res.send("error");
      }
    });
});

// ****************************************************************
exports.bhms = functions.https.onRequest(app);
