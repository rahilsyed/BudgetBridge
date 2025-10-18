"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const income_routes_1 = __importDefault(require("./income.routes"));
const expense_routes_1 = __importDefault(require("./expense.routes"));
const bankaccount_routes_1 = __importDefault(require("./bankaccount.routes"));
const router = (0, express_1.Router)();
router.use("/user", user_route_1.default);
router.use("/income", income_routes_1.default);
router.use("/expense", expense_routes_1.default);
router.use("/bankaccount", bankaccount_routes_1.default);
exports.default = router;
//# sourceMappingURL=api.routes.js.map