import bcrypt from 'bcryptjs';
import utils from '../helpers/utils.helper';
import { Request, Response } from 'express';
import {UploadedFile} from 'express-fileupload'
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  validationError,
  notFoundResponse,
} from '../helpers/api_response.helper';
import User from '../models/user.model';
import { WelcomeEmailData } from '../types/user.types';
import { profile } from 'console';

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone } = req.body;

  try {
    if (!firstName || !lastName || !email || !phone) {
      return validationError(res, 'Missing required fields');
    }

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return validationError(
        res,
        `User with  ${email} or ${phone} already exist`
      );
    }
    let image = req.files?.img as UploadedFile;
console.log(image.tempFilePath)
    let uploadedImageUrl = '';
      if (image) {
      // imgFile is either a single file or an array (if multiple)
      const filePath = image.tempFilePath;
      uploadedImageUrl = await utils.uploadToCloudinary(filePath, 'profilePhoto');
    }
    console.log(uploadedImageUrl)
    // console.log("uploadedImageUrl", uploadedImageUrl)
    const password = utils.generatePassword();
    const encryptedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      firstName,
      lastName,
      email,
      phone: phone,
      imgUrl: uploadedImageUrl,
      password: encryptedPassword,
    });

    await newUser.save();

    const userData: WelcomeEmailData = { firstName, lastName, email, password };

    utils.sendEmail(email, 'Greetings!', userData);
    return successResponse(res, 'User Added Successfully', newUser);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    console.log(req.body);
    if (!userName || !password) {
      return validationError(res, 'Missing required fields');
    }
    const user = await User.findOne({
      $or: [{ email: userName }, { phone: userName }],
    });
    console.log(user);
    if (!user) {
      return unauthorizedResponse(res, 'User Not Found in database');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return validationError(res, 'Incorrect password!!!');
    }
    const token = utils.generateToken(user);
    let response = {
      user,
      token,
    };
    return successResponse(res, 'Login successful', response);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    if (!email || !currentPassword || !newPassword) {
      return validationError(res, 'Missing required fields');
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return validationError(res, 'User with this email does not exists');
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userExists.password
    );
    if (!isPasswordValid) {
      return validationError(res, 'Passoword you entered does not match');
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userExists._id, {
      password: encryptedPassword,
    });

    return successResponse(res, 'Password reset successfully', null);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};


export const getUserInfo = async(req: Request, res: Response)=>{
  try{
    const userId = await utils.getUserId(req);
    const user = await User.findById(userId).select('-password -__v -_id');
    if(!user){
    return notFoundResponse(res,'User not found');
    } 
return successResponse(res, 'User details found successfully', user)
  }catch(error:any){
    return errorResponse(res, error.message);
  }
}
