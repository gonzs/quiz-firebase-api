import { Application } from 'express';
import {
  setUserRole,
  addQuestion,
  getQuizBySubject,
  testFirebase,
  saveResults,
  getSubjects,
  addQuiz
} from './controller';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';

export function routesConfigQuiz(app: Application) {
  // GET - test
  app.get('/test', testFirebase);

  // GET - Set role to the user registered
  app.get('/role:uid', setUserRole);

  // GET -  Quiz for a :subject
  app.get(
    '/subj/:subject',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    getQuizBySubject
  );

  // GET -  Get Subjects
  app.get(
    '/subjects',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    getSubjects
  );

  // POST - Create new question for a subject
  app.post(
    '/add-question',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    addQuestion
  );

  app.post(
    '/new-quiz',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    addQuiz
  );

  // POST - Save results
  app.post(
    '/results',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    saveResults
  );
}
