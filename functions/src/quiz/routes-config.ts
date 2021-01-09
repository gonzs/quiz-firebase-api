import { Application } from 'express';
import {
  addQuestion,
  getQuizBySubject,
  testFirebase,
  saveResults
} from './controller';

export function routesConfigQuiz(app: Application) {
  // GET - test
  app.get('/test', testFirebase);

  // GET -  Quiz for a :subject
  app.get('/:subject', getQuizBySubject);

  // POST - Create new question for a subject
  app.post('/add-question', addQuestion);

  // POST - Save results
  app.post('/results', saveResults);
}
