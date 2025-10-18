import bcrypt from 'bcryptjs';
import utils from '../helpers/utils.helper';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  validationError,
  notFoundResponse,
} from '../helpers/api_response.helper';
import User from '../models/user.model';
import { WelcomeEmailData } from '../types/user.types';

const register = async (req: Request, res: Response) => {
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
    let uploadedImageUrl = '';
    if (image) {
      const filePath = image.tempFilePath;
      uploadedImageUrl = await utils.uploadToCloudinary(
        filePath,
        'profilePhoto'
      );
    }
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

    await utils.sendEmail(email, 'Greetings!', userData);
    return successResponse(res, 'User Added Successfully', newUser);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return validationError(res, 'Missing required fields');
    }
    const user = await User.findOne({
      $or: [{ email: userName }, { phone: userName }],
    });
    if (!user) {
      return unauthorizedResponse(res, 'User Not Found in database');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
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


const resetPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const userId = utils.getUserId(req);
    const userExists = await User.findById(userId);

    if (!userExists) {
      return notFoundResponse(res, 'user not found in database');
    }
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userExists.password
    );
    if (!isPasswordValid) {
      return validationError(res, 'Old password is not a valid password');
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: encryptedPassword } }
    );
    return successResponse(res, 'Password reset Successfully', null);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = await utils.getUserId(req);
    const user = await User.findById(userId).select('-password -__v -_id');
    if (!user) {
      return notFoundResponse(res, 'User not found');
    }
    return successResponse(res, 'User details found successfully', user);
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return validationError(res, 'User with this email does not existes');
    }
    const newPassword = utils.generatePassword();
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email },
      { $set: { password: encryptedPassword } }
    );

    const userData = {
      firstName: userExists.firstName,
      lastName: userExists.lastName,
      email,
      password: newPassword,
    };

    await utils.sendEmail(
      userExists.email,
      'Your New Password Arrived',
      userData
    );

    return successResponse(res, 'Password Arrived on email', userData);
  } catch (error) { }
};

export default {
  register,
  login,
  getUserInfo,
  resetPassword,
  forgetPassword,
};
