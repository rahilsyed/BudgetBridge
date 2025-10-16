"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const income_routes_1 = __importDefault(require("./income.routes"));
const expense_routes_1 = __importDefault(require("./expense.routes"));
const bankaccount_routes_1 = __importDefault(require("./bankaccount.routes"));
const app = (0, express_1.default)();
app.use("/user", user_route_1.default);
app.use("/income", income_routes_1.default);
app.use("/expense", expense_routes_1.default);
app.use("/bankaccount", bankaccount_routes_1.default);
exports.default = app;
//# sourceMappingURL=api.routes.js.map