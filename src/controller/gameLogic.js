"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var controller_tile_1 = require("./controller.tile");
var hand_1 = require("../models/hand");
var database_1 = require("../database");
var GameLogic = /** @class */ (function () {
    function GameLogic(userIDs) {
        this.currentPlayerIndex = -1;
        this.gameDone = false;
        // get userIDs and update all
        this.userIDs = userIDs;
        this.currentPlayer = this.determineStartPlayer();
        this.posMap = new Map();
        this.posMap.set(this.currentPlayerIndex, hand_1.House.EAST);
        this.posMap.set((this.currentPlayerIndex + 1) % 4, hand_1.House.SOUTH);
        this.posMap.set((this.currentPlayerIndex + 2) % 4, hand_1.House.WEST);
        this.posMap.set((this.currentPlayerIndex + 3) % 4, hand_1.House.NORTH);
        this.currentDiscarded = { tileType: "", tileNum: "", id: "" };
        this.initHands();
        this.drawCard();
    }
    /**
     * randomly select a card that is in the deck to be placed into the current player's hand
     */
    GameLogic.prototype.drawCard = function () {
        // get all available tiles where tilesOwnership is None
        // randomly select 1 tile in this deck to assign to user
        var jsonObj = (0, controller_tile_1.getAllTiles)({ id: "None" });
        var availableTiles = jsonObj;
        var randomNum = Math.floor(Math.random() * availableTiles.length);
        var chosenTile = availableTiles.splice(randomNum, 1)[0];
        (0, controller_tile_1.updateTile)({
            id: chosenTile.id,
            visibility: this.posMap.get(this.currentPlayerIndex),
            hand: this.posMap.get(this.currentPlayerIndex),
        });
    };
    /**
     * requires that the player has 2 of the current card on the table and they answer the trivia correctly
     */
    GameLogic.prototype.pung = function (userID) {
        // query the cards that the player currently holds
        if (this.trivia()) {
            if (this.checkTiles("pung")) {
                this.currentPlayerIndex = this.userIDs.indexOf(userID);
                this.currentPlayer = userID;
                return true;
            }
        }
        return false;
    };
    /**
     * requires that the player has a straight of cards --> 1, 2, 3 or 1, 3, 2
     */
    GameLogic.prototype.chow = function (userID) {
        var nextUser = this.userIDs[(this.currentPlayerIndex + 1) % this.userIDs.length];
        if (userID == nextUser) {
            if (this.trivia()) {
                if (this.checkTiles("chow")) {
                    this.currentPlayer = userID;
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * update the database to showcase the card as discarded
     */
    GameLogic.prototype.discard = function (tileID) {
        var jsonObj = (0, controller_tile_1.getOneTile)({ id: String(this.currentPlayer) });
        var currPlayersHand = jsonObj;
        var tileIDsInHand = new Set();
        currPlayersHand.forEach(function (tile) {
            tileIDsInHand.add(tile.id);
        });
        if (tileIDsInHand.has(tileID)) {
            this.currentDiscarded = currPlayersHand.find(function (tile) { return tile.id === tileID; }); // get tile from dataBase
            (0, controller_tile_1.updateTile)({ id: tileID, visibility: hand_1.House.ALL, hand: hand_1.House.ALL });
        }
    };
    GameLogic.prototype.checkTiles = function (checkType) {
        var _this = this;
        var jsonObj = (0, controller_tile_1.getOneTile)({ id: this.currentPlayer });
        var currPlayersHand = jsonObj;
        if (checkType == "chow") {
            // checks to see sequentual numbering of the same tileType
            var playersMatchingType_1 = new Set();
            currPlayersHand.forEach(function (tile) {
                if (tile.tileType == _this.currentDiscarded.tileType) {
                    playersMatchingType_1.add(tile);
                }
            });
            var playersTileNums_1 = new Set();
            playersMatchingType_1.forEach(function (tile) {
                playersTileNums_1.add(tile.tileNum);
            });
            if (String(Number(this.currentDiscarded.tileNum) + 1) in playersTileNums_1 &&
                String(Number(this.currentDiscarded.tileNum) + 2) in playersTileNums_1) {
                return true;
            }
            else if (String(Number(this.currentDiscarded.tileNum) - 1) in playersTileNums_1 &&
                String(Number(this.currentDiscarded.tileNum) - 2) in playersTileNums_1) {
                return true;
            }
            else if (String(Number(this.currentDiscarded.tileNum) - 1) in playersTileNums_1 && String(Number(this.currentDiscarded.tileNum) + 1) in playersTileNums_1) {
                return true;
            }
            return false;
        }
        else if (checkType == "pung") {
            // checks to see that the
            var playersMatching_1 = new Array();
            currPlayersHand.forEach(function (tile) {
                if (tile.tileType === _this.currentDiscarded.tileType &&
                    tile.tileNum === _this.currentDiscarded.tileNum) {
                    playersMatching_1.push(tile);
                }
            });
            if (playersMatching_1.length >= 2) {
                return true;
            }
            return false;
        }
        return false;
    };
    /**
     * get a trivia question from database and return the question, 4 options and the correct answer, if they answer trivia correct, then check that they can actually pung/chow,
     * if they can't pung chow then return 0, otherwise return 1
     */
    GameLogic.prototype.trivia = function () {
        // get trivia answer
        // if () {
        //     return true;
        // }
        return false;
    };
    /**
     * initialize the hands of all players -- update the ownership of random tiles in the database so long as the tile's current ownership is None
     */
    GameLogic.prototype.initHands = function () {
        var _this = this;
        var jsonObj = (0, controller_tile_1.getAllTiles)({ id: "None" });
        var availableCards = jsonObj;
        this.userIDs.forEach(function (user) {
            for (var tile = 0; tile < 13; tile++) {
                var randomNum = Math.floor(Math.random() * availableCards.length);
                // random choose tileID in list of available tileIDs if they are not owned
                var poppedTile = availableCards.splice(randomNum, 1)[0];
                (0, controller_tile_1.updateTile)({
                    id: poppedTile.id,
                    visibility: _this.posMap.get(_this.currentPlayerIndex),
                    hand: _this.posMap.get(_this.currentPlayerIndex),
                });
            }
        });
    };
    GameLogic.prototype.determineStartPlayer = function () {
        var numPlayers = this.userIDs.length;
        this.currentPlayerIndex = Math.floor(Math.random() * numPlayers);
        var currentPlayer = this.userIDs[this.currentPlayerIndex];
        return currentPlayer;
    };
    return GameLogic;
}());
function main() {
    //updateDataBase
    var idNum = 0;
    (0, database_1.connectMongo)(function () {
        (0, database_1.connectedToMongo)() ? void 0 : void 0;
    });
    for (var tileType = 0; tileType < 10; tileType++) {
        if (tileType < 3) {
            for (var tileNum = 0; tileNum < 10; tileNum++) {
                for (var index = 0; index < 4; index++) {
                    (0, controller_tile_1.createTile)({
                        tileType: String(tileType),
                        tileNum: String(tileNum),
                        id: String(idNum),
                        visibility: hand_1.House.NONE,
                        hand: hand_1.House.NONE,
                    });
                    idNum++;
                }
            }
        }
        else {
            for (var index = 0; index < 4; index++) {
                (0, controller_tile_1.createTile)({
                    tileType: String(tileType),
                    tileNum: "0",
                    id: String(idNum),
                    visibility: hand_1.House.NONE,
                    hand: hand_1.House.NONE,
                });
                idNum++;
            }
        }
    }
    var test = new GameLogic(["1", "2", "3", "4"]);
    console.log(test.userIDs);
}
main();
