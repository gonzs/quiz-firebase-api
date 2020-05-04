const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const serviceAccount = require("./permissions.json");

const app = express();
app.use(cors({ origin: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quiz-firebase-api.firebaseio.com",
});

const db = admin.firestore();

// * Routes *

// test - GET
app.get("/test", (req, res) => {
  return res.status(200).send("Hello from Firebase!");
});

// Create - POST
app.post("/api/add-question", (req, res) => {
  (async () => {
    try {
      await db
        .collection(req.body.subject)
        .doc("/" + req.body.id + "/")
        .create({
          title: req.body.title,
          correct: req.body.correct,
          options: req.body.options || [],
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Read quiz for a subject - GET
app.get("/api/:subject", (req, res) => {
  (async () => {
    try {
      const document = db.collection(req.params.subject);
      let response = [];

      await document.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          const selItem = {
            id: doc.id,
            title: doc.data().title,
            correct: doc.data().correct,
            options: doc.data().options,
          };
          response.push(selItem);
        }
        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// * Export API to cloud functions
exports.app = functions.https.onRequest(app);
