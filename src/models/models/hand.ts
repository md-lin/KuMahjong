import mongoose from "mongoose"

export enum House {
    EAST = "East",
    WEST = "West",
    SOUTH = "South",
    NORTH = "North",
    ALL = "All",
    NONE = "None"
}

export interface IHand {
    username: string,
    id: string,
    house: House
}

export const handSchema = new mongoose.Schema({
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

const Hand = mongoose.model<IHand>('Hand', handSchema);
export default Hand;