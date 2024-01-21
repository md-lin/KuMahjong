import mongoose from "mongoose";
import Hand, { House } from "../models/hand";

export async function createHand (
    hand: {
        username: string,
        id: string,
        house: House
    }
): Promise<void> {
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
            _id: undefined,
            is_deleted: undefined
        }

        await session.commitTransaction();
        await session.endSession();
        console.log("Created")
        return;
    } else {
        await session.abortTransaction();
        await session.endSession();
        console.log("Not created")
        return;
    }
}