import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

export async function testFirebase(req: Request, res: Response) {
  return res.status(200).send('Hello from Firebase!!!');
}

export async function addQuestion(req: Request, res: Response) {
  const db = admin.firestore();

  try {
    const { id, subject, title, correct, options } = req.body;

    await db
      .collection(subject)
      .doc('/' + id + '/')
      .create({
        title: title,
        correct: correct,
        options: options || []
      });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getQuizBySubject(req: Request, res: Response) {
  const db = admin.firestore();

  try {
    const { subject } = req.params;
    const document = db.collection(subject);
    const response: Array<any> = [];

    await document.get().then((querySnapshot) => {
      const docs = querySnapshot.docs;

      for (const doc of docs) {
        const selItem = {
          id: doc.id,
          title: doc.data().title,
          correct: doc.data().correct,
          options: doc.data().options
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
}

export async function saveResults(req: Request, res: Response) {
  const db = admin.firestore();
  const { subject, score } = req.body;

  try {
    await db
      .collection('results')
      .doc()
      .create({ subject: subject, score: score });

    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
