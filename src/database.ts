// import logger from "logger";
import mongoose, { ConnectOptions } from "mongoose";
import { configs } from "./configs";

export function connectMongo(onSuccess: () => void): void {
    const connectionUri = configs.mongo.getUri();
    mongoose.set("strictQuery", false);
    mongoose
        .connect(connectionUri, { useNewUrlParser: true, useUnifiedTopology: true, } as unknown as ConnectOptions)
        .then(() => {
            console.log("Connected")
            onSuccess();
        })
        .catch((err) => {
            console.log("Not")
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
