"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.getOneTile = exports.getAllTiles = exports.updateTile = exports.createTile = void 0;
var mongoose_1 = require("mongoose");
var tile_1 = require("../models/tile");
function createTile(tile) {
    return __awaiter(this, void 0, void 0, function () {
        var session, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.startSession()];
                case 1:
                    session = _a.sent();
                    session.startTransaction();
                    return [4 /*yield*/, new tile_1.default({
                            tileType: tile.tileType,
                            tileNum: tile.tileNum,
                            id: tile.id,
                            visibility: tile.visibility,
                            hand: tile.hand,
                        }).save({ session: session })];
                case 2:
                    result = _a.sent();
                    if (!result) return [3 /*break*/, 5];
                    data = __assign(__assign({}, result.toJSON()), { _id: undefined, is_deleted: undefined });
                    return [4 /*yield*/, session.commitTransaction()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 4:
                    _a.sent();
                    console.log("Created tile");
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, session.abortTransaction()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 7:
                    _a.sent();
                    console.log("Not created");
                    return [2 /*return*/];
            }
        });
    });
}
exports.createTile = createTile;
function updateTile(tile) {
    return __awaiter(this, void 0, void 0, function () {
        var session, updateQuery, filter, updated, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.startSession()];
                case 1:
                    session = _a.sent();
                    session.startTransaction();
                    updateQuery = {
                        $set: {
                            visibility: tile.visibility,
                            hand: tile.hand,
                        },
                    };
                    filter = {
                        id: tile.id,
                    };
                    return [4 /*yield*/, tile_1.default.findOneAndUpdate(filter, updateQuery, {
                            new: true,
                            session: session,
                        }).lean()];
                case 2:
                    updated = _a.sent();
                    if (!updated) return [3 /*break*/, 5];
                    data = __assign(__assign({}, updated), { _id: undefined });
                    return [4 /*yield*/, session.commitTransaction()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 4:
                    _a.sent();
                    console.log("Created tile");
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, session.abortTransaction()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 7:
                    _a.sent();
                    console.log("Not created");
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateTile = updateTile;
function getAllTiles(hand) {
    return __awaiter(this, void 0, void 0, function () {
        var session, filter, found, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.startSession()];
                case 1:
                    session = _a.sent();
                    session.startTransaction();
                    filter = {
                        hand: hand.id,
                    };
                    return [4 /*yield*/, tile_1.default.find(filter)];
                case 2:
                    found = _a.sent();
                    if (!found) return [3 /*break*/, 5];
                    data = __assign(__assign({}, found), { _id: undefined });
                    return [4 /*yield*/, session.commitTransaction()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 4:
                    _a.sent();
                    console.log("Found");
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, session.abortTransaction()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 7:
                    _a.sent();
                    console.log("Not found");
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllTiles = getAllTiles;
function getOneTile(tile) {
    return __awaiter(this, void 0, void 0, function () {
        var session, filter, found, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.startSession()];
                case 1:
                    session = _a.sent();
                    session.startTransaction();
                    filter = {
                        tile: tile.id,
                    };
                    return [4 /*yield*/, tile_1.default.findOne(filter)];
                case 2:
                    found = _a.sent();
                    if (!found) return [3 /*break*/, 5];
                    data = __assign(__assign({}, found), { _id: undefined });
                    return [4 /*yield*/, session.commitTransaction()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 4:
                    _a.sent();
                    console.log("Found");
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, session.abortTransaction()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, session.endSession()];
                case 7:
                    _a.sent();
                    console.log("Not found");
                    return [2 /*return*/];
            }
        });
    });
}
exports.getOneTile = getOneTile;
