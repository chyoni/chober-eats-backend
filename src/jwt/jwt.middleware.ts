import { NextFunction, Request, Response } from 'express';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  //모든 미들웨어는 수행할 것 다 수행한 후 next() 호출할 것
  next();
}
