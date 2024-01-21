"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedToMongo = exports.connectMongo = void 0;
// import logger from "logger";
var mongoose_1 = require("mongoose");
var configs_1 = require("./configs");
function connectMongo(onSuccess) {
    var connectionUri = configs_1.configs.mongo.getUri();
    mongoose_1.default.set("strictQuery", false);
    mongoose_1.default
        .connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true, })
        .then(function () {
        console.log("Connected");
        onSuccess();
    })
        .catch(function (err) {
        console.log("Not");
    });
}
exports.connectMongo = connectMongo;
function connectedToMongo() {
    return mongoose_1.default.connection.readyState === 1;
}
exports.connectedToMongo = connectedToMongo;
