import bcrypt from 'bcryptjs';
import utils from '../helpers/utils.helper';
import { Request, Response } from 'express';
import {
  errorResponse,
  unauthorizedResponse,
  successResponse,
  validationError,
} from '../helpers/api_response.helper';
import User from '../models/user.model';


const register = async (req: Request, res: Response): Promise<any> => {
  try {

    const { firstName, lastName, email, phone, imgUrl, password } = req.body;
console.log("body", req.body)
    if (!firstName || !lastName || !email || !phone || !password) {
      return validationError(res, 'Missing required fields');
    }

    const userExists = await User.findOne({$or:[{ email }, {phone}]});
    if (userExists) {
      return validationError(
        res,
        `User with this email:${email || phone} already exist`
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      firstName,
      lastName,
      email,
      phone: phone,
      imgUrl,
      password: encryptedPassword,
    });
    console.log(newUser)
    console.log(newUser.phone);
    await newUser.save();
    return successResponse(res, 'User Added Successfully', newUser);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
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

export default { register, login };
