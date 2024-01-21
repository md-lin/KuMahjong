"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tileSchema = void 0;
var mongoose_1 = require("mongoose");
var hand_1 = require("./hand");
exports.tileSchema = new mongoose_1.default.Schema({
    tileType: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    tileNum: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: hand_1.House,
    },
    hand: {
        type: String,
        enum: hand_1.House,
    }
});
var Tile = mongoose_1.default.model('Tile', exports.tileSchema);
exports.default = Tile;
