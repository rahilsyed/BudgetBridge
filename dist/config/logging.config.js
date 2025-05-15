"use strict";
const info = (namespace, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`, object);
    }
    else {
        console.info(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`);
    }
};
const warn = (namespace, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
    }
    else {
        console.info(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
    }
};
const error = (namespace, message, object) => {
    if (object) {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`, object);
    }
    else {
        console.error(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
    }
};
const debug = (namespace, message, object) => {
    if (object) {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`, object);
    }
    else {
        console.debug(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
    }
};
const getTimeStamp = () => {
    return new Date().toISOString();
};
module.exports = {
    debug,
    info,
    warn,
    error
};
