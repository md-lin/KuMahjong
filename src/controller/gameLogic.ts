// import Tile, {ITile} from "../models/tile"
// import { updateTile, getAllTiles, getOneTile } from "./controller.tile";
// import {House} from "../models/hand"
// import { connect } from "mongoose";

// import { connectMongo, connectedToMongo } from "../database";

// class GameLogic {
//     userIDs:string[];
//     currentPlayer:string;
//     currentPlayerIndex:number | undefined;
//     currentDiscarded:ITile | undefined;
//     posMap:Map<number, House>;
//     gameDone:boolean = false;

//     constructor(userIDs:string[]) {
//         // get userIDs and update all
//         this.userIDs = userIDs;
//         this.currentPlayer = this.determineStartPlayer();
//         this.posMap = new Map<number, House>();
//         this.posMap.set(this.currentPlayerIndex, House.EAST);
//         this.posMap.set((this.currentPlayerIndex + 1) % 4, House.SOUTH);
//         this.posMap.set((this.currentPlayerIndex + 2) % 4, House.WEST);
//         this.posMap.set((this.currentPlayerIndex + 3) % 4, House.NORTH);
//         this.initHands();
//         this.drawCard();
//     }

//     /**
//      * randomly select a card that is in the deck to be placed into the current player's hand
//      */
//     public drawCard() {
//         // get all available tiles where tilesOwnership is None
//         // randomly select 1 tile in this deck to assign to user
//         let jsonObj = getAllTiles({id:"None"});
//         const availableTiles = jsonObj as unknown as ITile[];
//         let randomNum:number = Math.floor(Math.random() * availableTiles.length);
//         let chosenTile:ITile = availableTiles.splice(randomNum, 1)[0];
//         updateTile({id:chosenTile.id, visibility:this.posMap.get(this.currentPlayerIndex), hand:this.posMap.get(this.currentPlayerIndex)})
//     }

//     /**
//      * requires that the player has 2 of the current card on the table and they answer the trivia correctly
//      */
//     public pung(userID:string): boolean {
//         // query the cards that the player currently holds
//         if (this.trivia()) {
//             if (this.checkTiles("pung")) {
//                 this.currentPlayerIndex = this.userIDs.indexOf(userID);
//                 this.currentPlayer = userID;
//                 return true;
//             }
//         }
//         return false;
//     }

//     /**
//      * requires that the player has a straight of cards --> 1, 2, 3 or 1, 3, 2
//      */
//     public chow(userID:string): boolean {
//         const nextUser:string = this.userIDs[(this.currentPlayerIndex + 1) % this.userIDs.length];
//         if (userID == nextUser) {
//             if (this.trivia()) {
//                 if (this.checkTiles("chow")) {
//                     this.currentPlayer = userID;
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     /**
//      * update the database to showcase the card as discarded
//      */
//     public discard(tileID:string) {
//         let jsonObj = getOneTile({id:String(this.currentPlayer)});
//         const currPlayersHand = jsonObj as unknown as ITile[];
//         let tileIDsInHand:Set<string>;
//         currPlayersHand.forEach(tile => {
//             tileIDsInHand.add(tile.id);
//         });

//         if (tileIDsInHand.has(tileID)) {
//             this.currentDiscarded = currPlayersHand.find(tile => tile.id === tileID); // get tile from dataBase
//             updateTile({id:tileID, visibility:House.ALL, hand:House.ALL});
//         }
//     }

//     private checkTiles(checkType:String): boolean {
//         let jsonObj = getOneTile({id:this.currentPlayer});
//         const currPlayersHand = jsonObj as unknown as ITile[];

//         if (checkType == "chow") {
//             // checks to see sequentual numbering of the same tileType
//             let playersMatchingType:Set<ITile>;
//             currPlayersHand.forEach(tile => {
//                 if (tile.tileType == this.currentDiscarded.tileType) {
//                     playersMatchingType.add(tile);
//                 }
//             });
//             let playersTileNums:Set<string>;
//             playersMatchingType.forEach(tile => {
//                 playersTileNums.add(tile.tileNum);
//             });

//             if (String(Number(this.currentDiscarded.tileNum) + 1) in playersTileNums && String(Number(this.currentDiscarded.tileNum) + 2) in playersTileNums) {
//                 return true;
//             }
//             else if (String(Number(this.currentDiscarded.tileNum) - 1) in playersTileNums && String(Number(this.currentDiscarded.tileNum) - 2) in playersTileNums) {
//                 return true;
//             }
//             return false;
//         }
//         else if (checkType == "pung") {
//             // checks to see that the
//             let playersMatching:Array<ITile>;
//             currPlayersHand.forEach(tile => {
//                 if (tile.tileType === this.currentDiscarded.tileType && tile.tileNum === this.currentDiscarded.tileNum) {
//                     playersMatching.push(tile);
//                 }
//             })
//             if (playersMatching.length === 2) {
//                 return true;
//             }
//             return false;
//         }
//         return false;
//     }

//     /**
//      * get a trivia question from database and return the question, 4 options and the correct answer, if they answer trivia correct, then check that they can actually pung/chow,
//      * if they can't pung chow then return 0, otherwise return 1
//      */
//     private trivia(): boolean {
//         // get trivia answer
//         // if () {
//         //     return true;
//         // }
//         return false;
//     }

//     /**
//      * initialize the hands of all players -- update the ownership of random tiles in the database so long as the tile's current ownership is None
//      */
//     private initHands() {
//         let jsonObj = getAllTiles({id:"None"});
//         let availableCards = jsonObj as unknown as ITile[];
//         this.userIDs.forEach(user => {
//             for (let tile = 0; tile < 13; tile++) {
//                 let randomNum:number = Math.floor(Math.random() * availableCards.length);
//                 // random choose tileID in list of available tileIDs if they are not owned
//                 let poppedTile:ITile = availableCards.splice(randomNum, 1)[0];
//                 updateTile({id:poppedTile.id, visibility:this.posMap.get(this.currentPlayerIndex), hand:this.posMap.get(this.currentPlayerIndex)});
//             }
//         });
//     }

//     private determineStartPlayer(): string {
//         let numPlayers = this.userIDs.length;
//         this.currentPlayerIndex = Math.floor(Math.random() * numPlayers);
//         let currentPlayer = this.userIDs[this.currentPlayerIndex];
//         return currentPlayer;
//     }
// }

// function main() {
//     //updateDataBase
//     connectMongo(() => {(connectedToMongo()) ? void 0 : void 0});

//     let test = new GameLogic(["1", "2", "3", "4"]);
//     console.log(test.userIDs);
// }

// main();