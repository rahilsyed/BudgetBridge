"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const db_config_1 = __importDefault(require("./config/db.config"));
const logging_config_1 = __importDefault(require("./config/logging.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_routes_1 = __importDefault(require("./routes/api.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const NAMESPACE = 'Server';
//Database connection
(0, db_config_1.default)();
app.set('view engine', 'ejs');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp',
    limits: { fileSize: 5000000 }, //5mb
    abortOnLimit: true,
    responseOnLimit: 'File size must be 5mb or less',
}));
app.use((req, res, next) => {
    //log the req
    logging_config_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL [${req.url}] - IP: [${req.socket.remoteAddress}]]`);
    res.on('finish', () => {
        // Log the res
        logging_config_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
app.use('/api', api_routes_1.default);
// app.get("/",(req:Request, res:Response)=>{
//     console.log("api working");
// })
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map