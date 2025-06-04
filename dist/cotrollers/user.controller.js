"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_helper_1 = __importDefault(require("../helpers/utils.helper"));
const api_response_helper_1 = require("../helpers/api_response.helper");
const user_model_1 = __importDefault(require("../models/user.model"));
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, imgUrl, password } = req.body;
        console.log("body", req.body);
        if (!firstName || !lastName || !email || !phone || !password) {
            return (0, api_response_helper_1.validationError)(res, 'Missing required fields');
        }
        const userExists = await user_model_1.default.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return (0, api_response_helper_1.validationError)(res, `User with this email:${email || phone} already exist`);
        }
        const encryptedPassword = await bcryptjs_1.default.hash(password, 10);
        let newUser = new user_model_1.default({
            firstName,
            lastName,
            email,
            phone: phone,
            imgUrl,
            password: encryptedPassword,
        });
        console.log(newUser);
        console.log(newUser.phone);
        await newUser.save();
        return (0, api_response_helper_1.successResponse)(res, 'User Added Successfully', newUser);
    }
    catch (err) {
        return (0, api_response_helper_1.errorResponse)(res, err.message);
    }
};
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
exports.default = { register, login };
//# sourceMappingURL=user.controller.js.map