"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const logging_config_1 = __importDefault(require("./logging.config"));
dotenv_1.default.config();
const MONGO_URL = process.env.DATABASE_URL; // here "!" is non null assertion operator which tell typescript trustme the Value is not null
const connectToDB = () => {
    mongoose_1.default.connect(MONGO_URL)
        .then(() => {
        logging_config_1.default.info('DATABASE', 'Connected to the database at :', MONGO_URL);
    })
        .catch((err) => {
        logging_config_1.default.error('Error connecting to the database', err);
        process.exit(1);
    });
};
exports.default = connectToDB;
