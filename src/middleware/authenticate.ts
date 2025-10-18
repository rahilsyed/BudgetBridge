import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { unauthorizedResponse, validationError } from '../helpers/api_response';
dotenv.config();

const secret = process.env.JWT_SECRET!;
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization!.split(' ')[1];
    if(!token){
      return validationError(res, 'Token not found')
    }
    jwt.verify(token, secret);
    next();
  } catch (error: any) {
    return unauthorizedResponse(res, 'You are not authorize');
  }
};
