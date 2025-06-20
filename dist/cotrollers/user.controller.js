"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.resetPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_helper_1 = __importDefault(require("../helpers/utils.helper"));
const api_response_helper_1 = require("../helpers/api_response.helper");
const user_model_1 = __importDefault(require("../models/user.model"));
const register = async (req, res) => {
    const { firstName, lastName, email, phone, imgUrl } = req.body;
    try {
        if (!firstName || !lastName || !email || !phone) {
            return (0, api_response_helper_1.validationError)(res, 'Missing required fields');
        }
        const userExists = await user_model_1.default.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return (0, api_response_helper_1.validationError)(res, `User with  ${email} or ${phone} already exist`);
        }
        const password = utils_helper_1.default.generatePassword();
        const encryptedPassword = await bcryptjs_1.default.hash(password, 10);
        let newUser = new user_model_1.default({
            firstName,
            lastName,
            email,
            phone: phone,
            imgUrl,
            password: encryptedPassword,
        });
        await newUser.save();
        const userData = { firstName, lastName, email, password };
        utils_helper_1.default.sendEmail(email, 'Greetings!', userData);
        return (0, api_response_helper_1.successResponse)(res, 'User Added Successfully', newUser);
    }
    catch (err) {
        return (0, api_response_helper_1.errorResponse)(res, err.message);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        console.log(req.body);
        if (!userName || !password) {
            return (0, api_response_helper_1.validationError)(res, 'Missing required fields');
        }
        const user = await user_model_1.default.findOne({
            $or: [{ email: userName }, { phone: userName }],
        });
        console.log(user);
        if (!user) {
            return (0, api_response_helper_1.unauthorizedResponse)(res, 'User Not Found in database');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            return (0, api_response_helper_1.validationError)(res, 'Incorrect password!!!');
        }
        const token = utils_helper_1.default.generateToken(user);
        let response = {
            user,
            token,
        };
        return (0, api_response_helper_1.successResponse)(res, 'Login successful', response);
    }
    catch (err) {
        return (0, api_response_helper_1.errorResponse)(res, err.message);
    }
};
exports.login = login;
const resetPassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    try {
        if (!email || !currentPassword || !newPassword) {
            return (0, api_response_helper_1.validationError)(res, 'Missing required fields');
        }
        const userExists = await user_model_1.default.findOne({ email });
        if (!userExists) {
            return (0, api_response_helper_1.validationError)(res, 'User with this email does not exists');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, userExists.password);
        if (!isPasswordValid) {
            return (0, api_response_helper_1.validationError)(res, 'Passoword you entered does not match');
        }
        const encryptedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await user_model_1.default.findByIdAndUpdate(userExists._id, {
            password: encryptedPassword,
        });
        return (0, api_response_helper_1.successResponse)(res, 'Password reset successfully', null);
    }
    catch (error) {
        return (0, api_response_helper_1.errorResponse)(res, error.message);
    }
};
exports.resetPassword = resetPassword;
const getUserInfo = async (req, res) => {
    try {
        const userId = await utils_helper_1.default.getUserId(req);
        const user = await user_model_1.default.findOne({ userId }).select('-password -__v');
        if (!user) {
            return (0, api_response_helper_1.notFoundResponse)(res, 'User not found');
        }
        return (0, api_response_helper_1.successResponse)(res, 'User details found successfully', user);
    }
    catch (error) {
        return (0, api_response_helper_1.errorResponse)(res, error.message);
    }
};
exports.getUserInfo = getUserInfo;
// export default { register, login, resetPassword, getUserInfo};
//# sourceMappingURL=user.controller.js.map