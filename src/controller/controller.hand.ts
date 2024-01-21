import mongoose from "mongoose";
import Hand, { House, IHand } from "../models/hand";

export async function createHand (
    hand: {
        username: string,
        id: string,
        house: House
    }
): Promise<IHand | undefined> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const result = await new Hand({
        username: hand.username,
        id: hand.id,
        house: hand.house
    }).save({session});

    if (result) {
        const data = {
            ...result.toJSON(),
        }

        await session.commitTransaction();
        await session.endSession();
        console.log("Created")
        return data
    } else {
        await session.abortTransaction();
        await session.endSession();
        console.log("Not created")
        return undefined;
    }
}