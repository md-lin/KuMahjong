import mongoose from "mongoose"
import { House } from "./hand";

export interface ITile {
    tileType: string,
    tileNum: string,
    id: string,
    visibility?: House,
    hand?: House
}

export const tileSchema = new mongoose.Schema({
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
        enum: House,
    },
    hand: {
        type: String,
        enum: House,
    }
});

const Tile = mongoose.model<ITile>('Tile', tileSchema);
export default Tile;