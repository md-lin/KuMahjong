"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handSchema = exports.House = void 0;
var mongoose_1 = require("mongoose");
var House;
(function (House) {
    House["EAST"] = "East";
    House["WEST"] = "West";
    House["SOUTH"] = "South";
    House["NORTH"] = "North";
    House["ALL"] = "All";
    House["NONE"] = "None";
})(House || (exports.House = House = {}));
exports.handSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    house: {
        type: String,
        enum: House,
        required: true
    }
});
var Hand = mongoose_1.default.model('Hand', exports.handSchema);
exports.default = Hand;
