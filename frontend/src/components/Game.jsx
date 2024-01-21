import TileSet from "./TileSet";
import PlayerTileSet from "./player/PlayerTileSet";
import Board from "./Board";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Game({ playerName, enemy1, enemy2, enemy3 }) {
    
    useEffect(() => {
        axios.get("http://localhost:4321/hello")
        .then(res => {
            console.log(res)
        })
    }, [] );
    
    return (
        <>
        <div id="game" className='h-[40rem] w-11/12 mx-10 p-3 bg-[#32596C] rounded-3xl shadow-xl relative'>
            <div id="play-board" className="absolute top-[4.5rem] left-[27.5rem]">
                <Board />
            </div>
            <div id="enemy-top-board-1" className="absolute text-left top-18 left-[26.5rem] transform rotate-180">
                <h3 className="font-bold p-1 text-center w-[5.25rem] shadow-1 bg-[#6E605A] text-white truncate rounded-md absolute top-6 -right-[5.25rem] transform -rotate-180">{ enemy2 }</h3>
                <TileSet className />
            </div>
            <div id="enemy-left-board" className="absolute top-[15rem] left-[11.5rem] transform rotate-90">
            <h3 className="font-bold p-1 text-center w-[5.25rem] shadow-1 bg-[#6E605A] text-white truncate rounded-md absolute top-[5.25rem] left-[22.5rem] transform -rotate-90">{ enemy1 }</h3>
                <TileSet />
            </div>
            <div id="enemy-right-board" className="absolute top-[15rem] left-[41.5rem] transform -rotate-90">
            <h3 className="font-bold p-1 text-center w-[5.25rem] shadow-1 bg-[#6E605A] text-white truncate rounded-md fixed top-[5.25rem] -right-4 transform rotate-90">{ enemy3 }</h3>
                <TileSet />
            </div>
            <div id="player-board" className="absolute bottom-[0.5rem]">
                <h2 className="font-bold p-2 text-center text-xl w-28 bg-[#6E605A] text-white truncate rounded-md absolute bottom-[3.5rem] -right-32 shadow-1">{ playerName }</h2>
                <PlayerTileSet />
            </div>
        </div>
        </>
    )
}