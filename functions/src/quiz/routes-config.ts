import { Application } from 'express';
import {
  setUserRole,
  addQuestion,
  getQuizBySubject,
  testFirebase,
  saveResults
} from './controller';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';

export function routesConfigQuiz(app: Application) {
  // GET - test
  app.get('/test', testFirebase);

  // POST - Set role to the user registered
  app.post('/role', isAuthenticated, setUserRole);

  // GET -  Quiz for a :subject
  app.get(
    '/:subject',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    getQuizBySubject
  );

  // POST - Create new question for a subject
  app.post(
    '/add-question',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager'] }),
    addQuestion
  );

  // POST - Save results
  app.post(
    '/results',
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    saveResults
  );
}
