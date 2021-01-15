import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

export function authMiddleware(req: Request, res: Response, next: any): any {
  const headerToken = req.headers.authorization;

  if (!headerToken) return res.status(401).send('No token provided');

  if (headerToken && headerToken.split(' ')[0] !== 'Bearer')
    return res.status(401).send('Invalid token');

  const token = headerToken.split(' ')[1];
  const auth = admin.auth();

  auth
    .verifyIdToken(token)
    .then(() => {
      // const uid = decodedToken.uid;
      next();
    })
    .catch(() => res.status(403).send('Could not authorize'));
}
