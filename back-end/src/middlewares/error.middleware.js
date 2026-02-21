"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMiddleware = function (err, req, res, next) {
    try {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
    catch (e) {
        console.error(e);
    }
};
exports.default = errorMiddleware;
