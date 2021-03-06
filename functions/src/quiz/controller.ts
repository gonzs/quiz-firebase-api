import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

export async function testFirebase(req: Request, res: Response) {
  return res.status(200).send('Hello from Firebase!!!');
}

export async function setUserRole(req: Request, res: Response) {
  try {
    const auth = admin.auth();
    const { uid } = req.params;
    const role = 'user';

    await auth.setCustomUserClaims(uid, { role });

    return res.status(200).send();
  } catch (error) {
    return handleError(res, error);
  }
}

export async function addQuestion(req: Request, res: Response) {
  try {
    const db = admin.firestore();
    const { id, subject, title, correct, options } = req.body;

    await db
      .collection(subject)
      .doc(`/${id}/`)
      .create({
        title: title,
        correct: correct,
        options: options || []
      });

    return res.status(200).send();
  } catch (error) {
    return handleError(res, error);
  }
}

export async function addQuiz(req: Request, res: Response) {
  try {
    const db = admin.firestore();
    const { quizName, questions } = req.body;
    const { email } = res.locals;

    await db
      .collection('subjects')
      .doc(`/${quizName}/`)
      .create({ created: email });

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      await db
        .collection(quizName)
        .doc(`/${i + 1}/`)
        .create({
          title: question.title,
          correct: question.correct,
          options: question.options || []
        });
    }
    return res.status(200).send();
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getQuizBySubject(req: Request, res: Response) {
  try {
    const db = admin.firestore();
    const { subject } = req.params;
    const document = db.collection(subject);

    const response: Array<any> = await document.get().then((querySnapshot) => {
      const docs = querySnapshot.docs;

      const responseItem = docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        correct: doc.data().correct,
        options: doc.data().options
      }));

      return responseItem;
    });

    return res.status(200).send(response);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function saveResults(req: Request, res: Response) {
  try {
    const db = admin.firestore();
    const { subject, score } = req.body;
    const { email } = res.locals;

    const resultsByEmailSubject = await db
      .collection(`results`)
      .doc(`/${email}-${subject}/`);

    const getDoc = await resultsByEmailSubject.get();

    if (getDoc.exists)
      await db
        .collection(`results`)
        .doc(`/${email}-${subject}/`)
        .set({ score });
    else
      await db
        .collection(`results`)
        .doc(`/${email}-${subject}/`)
        .create({ score });

    return res.status(200).send();
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getSubjects(req: Request, res: Response) {
  try {
    const db = admin.firestore();
    const document = db.collection(`subjects`);

    const response: Array<any> = await document.get().then((querySnapshot) => {
      const docs = querySnapshot.docs;

      const responseItem = docs.map((doc) => ({
        id: doc.id
      }));

      return responseItem;
    });

    return res.status(200).send(response);
  } catch (error) {
    return handleError(res, error);
  }
}

function handleError(res: Response, err: any) {
  console.log(err);
  return res.status(500).send({ code: err.code, message: err.message });
}
