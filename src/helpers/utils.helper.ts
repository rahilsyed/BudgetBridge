import {Request } from 'express';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import { User } from '../types/user.types';
dotenv.config();

const secret_key = process.env.JWT_SECRET!; 

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const getUserId =(req:Request)=>{
    let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if(token){
        let decodded : JwtPayload = jwt.verify(token, secret_key) as JwtPayload;
        let userId = decodded._id;
        return userId;
    }
}

const generateToken =(user: any)=>{
    let JwtPayload = user.toJSON();
    const secret = process.env.JWT_SECRET!;
    let token = jwt.sign(JwtPayload, secret);
    return token;
}

const sendEmail = async (to:string, subject: string , user: User)=>{
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth:{
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        }
    })
    const tempFilePath = path.resolve(__dirname,'../views/welcome.ejs')

  if (!fs.existsSync(tempFilePath)) {
    throw new Error('Template file not found');
  }

  const template = await ejs.renderFile(tempFilePath, {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    password: user.password,
  });

  // Sending email
  return transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: to,
    subject: subject,
    html: template,
  });
}


const generatePassword = ()=>{
  const possible ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdfghijklmnopqrstuvwxyz1234567890';
  let password='';
  for(let i=0;i<8;i++){
    password+= possible.charAt(Math.floor(Math.random()*possible.length))
  }
  return password;
}

export default {
    getUserId,
    generateToken,
    sendEmail,
    generatePassword
}