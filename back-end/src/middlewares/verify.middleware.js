"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_service_1 = require("../services/user.service");
var utils_1 = require("../utils");
var redisClient_1 = require("../utils/redisClient");
var env_config_1 = require("../config/env.config");
var verifyMiddleware = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user_info, ver_code_exists, ver_code, message_id, blured_email, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                if (!((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id))
                    throw {
                        success: false,
                        status: 401,
                        message: "Un authorized access, login to use this endpoint",
                        error: "User UnAuthorized Error",
                    };
                return [4 /*yield*/, (0, user_service_1.getUserById)(req.session.user.id)];
            case 1:
                user_info = _b.sent();
                if ("success" in user_info)
                    throw user_info;
                if (!!user_info.email_verified) return [3 /*break*/, 6];
                return [4 /*yield*/, redisClient_1.default.get(user_info.id)];
            case 2:
                ver_code_exists = _b.sent();
                if (!!ver_code_exists) return [3 /*break*/, 5];
                ver_code = (0, utils_1.generate_id)(5);
                return [4 /*yield*/, redisClient_1.default.setEx(user_info.id, parseInt(env_config_1.MAX_CODE_AGE || "60000") / 1000, ver_code)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, utils_1.send_email_code)(user_info.email, ver_code)];
            case 4:
                message_id = _b.sent();
                // const message_id = "asd2qwdaq3";
                if (typeof message_id !== "string")
                    throw {
                        success: false,
                        status: 500,
                        message: "An internal server error occured",
                        error: "Verification Email Faild",
                    };
                _b.label = 5;
            case 5:
                blured_email = (0, utils_1.blur_email)(user_info.email);
                throw {
                    success: false,
                    status: 403,
                    message: "Verification code has been sent to '".concat(blured_email, "'"),
                };
            case 6: return [2 /*return*/, next()];
            case 7:
                e_1 = _b.sent();
                next(e_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.default = verifyMiddleware;
