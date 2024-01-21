import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import Tile, { ITile } from "../models/tile";
import { House } from "../models/hand";

export async function createTile(tile: {
  tileType: string;
  tileNum: string;
  id: string;
  visibility?: House;
  hand?: House;
}): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  const result = await new Tile({
    tileType: tile.tileType,
    tileNum: tile.tileNum,
    id: tile.id,
    visibility: tile.visibility,
    hand: tile.hand,
  }).save({ session });

  if (result) {
    const data = {
      ...result.toJSON(),
      _id: undefined,
      is_deleted: undefined,
    };

    await session.commitTransaction();
    await session.endSession();
    console.log("Created tile");
    return;
  } else {
    await session.abortTransaction();
    await session.endSession();
    console.log("Not created");
    return;
  }
}

export async function updateTile(tile: {
  id: string;
  visibility?: House;
  hand?: House;
}): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  const updateQuery: UpdateQuery<ITile> = {
    $set: {
      visibility: tile.visibility,
      hand: tile.hand,
    },
  };

  const filter: FilterQuery<ITile> = {
    id: tile.id,
  };

  const updated = await Tile.findOneAndUpdate(filter, updateQuery, {
    new: true,
    session,
  }).lean();

  if (updated) {
    const data = {
      ...updated,
      _id: undefined,
    };

    await session.commitTransaction();
    await session.endSession();
    console.log("Created tile");
    return;
  } else {
    await session.abortTransaction();
    await session.endSession();
    console.log("Not created");
    return;
  }
}

export async function getAllTiles(hand: { id: string }): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  const filter: FilterQuery<ITile> = {
    hand: hand.id,
  };

  const found = await Tile.find(filter);

  if (found) {
    const data = {
      ...found,
      _id: undefined,
    };

    await session.commitTransaction();
    await session.endSession();
    console.log("Found");
    return;
  } else {
    await session.abortTransaction();
    await session.endSession();
    console.log("Not found");
    return;
  }
}

export async function getOneTile(tile: { id: string }): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  const filter: FilterQuery<ITile> = {
    tile: tile.id,
  };

  const found = await Tile.findOne(filter);

  if (found) {
    const data = {
      ...found,
      _id: undefined,
    };

    await session.commitTransaction();
    await session.endSession();
    console.log("Found");
    return;
  } else {
    await session.abortTransaction();
    await session.endSession();
    console.log("Not found");
    return;
  }
}
