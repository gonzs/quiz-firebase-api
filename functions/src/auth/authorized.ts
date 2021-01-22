import { Request, Response } from 'express';

export function isAuthorized(opts: {
  hasRole: Array<'admin' | 'manager' | 'user'>;
  allowSameUser?: boolean;
}) {
  return (req: Request, res: Response, next: any) => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send(`${role} - ${res.locals}`);

    if (opts.hasRole.includes(role)) return next();

    return res.status(403).send('console 2');
  };
}
