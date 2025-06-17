"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authenticate_middleware_1 = require("../middleware/authenticate.middleware");
const router = (0, express_1.Router)();
router.post('/register', user_controller_1.default.register);
router.post('/login', user_controller_1.default.login);
router.put('/resetpassword', user_controller_1.default.resetPassword);
router.get('/userInfo', authenticate_middleware_1.authenticate, user_controller_1.default.getUserInfo);
router.post('/forgetpassword', user_controller_1.default.forgetPassword);
exports.default = router;
//# sourceMappingURL=user.route.js.map