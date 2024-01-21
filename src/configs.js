"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
require("dotenv/config");
exports.configs = {
    environment: process.env.MAHJONG_ENVIRONMENT || "dev",
    api: {
        prefix: "/api/v1",
    },
    express: {
        host: process.env.MAHJONG_HOST_NAME || "0.0.0.0",
        port: process.env.MAHJONG_PORT_NUMBER || "102024",
    },
    mongo: {
        username: process.env.MAHJONG_MONGO_USERNAME || '',
        password: process.env.MAHJONG_MONGO_PASSWORD || '',
        uri: "mongodb+srv://$(username):$(password)@demo.xterv5r.mongodb.net/?retryWrites=true&w=majority",
        address: [
            {
                host: process.env.MAHJONG_MONGO_HOST || "",
                port: process.env.MAHJONG_MONGO_PORT || ""
            }
        ],
        getUri: function () {
            var uri = this.uri;
            uri = uri.replace("$(username)", this.username);
            uri = uri.replace("$(password)", this.password);
            return "mongodb+srv://mamajong:nwHack2024@mahjong.dsccwwo.mongodb.net/?retryWrites=true&w=majority";
        }
    }
};
