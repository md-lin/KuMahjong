import Cs from "../../assets/icon_cs_germ.png";
import Sauder from "../../assets/icon_sauder_snake.png";
import Eng from "../../assets/icon_eng_gear.png";

import moonA from "../../assets/icon_weather_fullmoon.png";
import moonB from "../../assets/icon_weather_gibbous.png";
import moonC from "../../assets/icon_weather_crescent.png";
import moonD from "../../assets/icon_weather_newmoon.png";

import birdA from "../../assets/icon_bird_thunderbird.png";
import birdB from "../../assets/icon_bird_dove.png";
import birdC from "../../assets/icon_bird_flamingo.png";

import axios from "axios";
import { useEffect } from "react";

/* The below import is for reference for the directory to the images */
import TastFile from "../../assets/TastFile";



export default function PlayerTile({ type, num = 0 }) {
    
    useEffect

    return (
        <>
        <button className="w-16 h-24 px-1 py-0.5 rounded bg-white hover:shadow-1 hover:border-2 hover:border-[#142e3d]" onClick={() => {
            axios.get("http://localhost:4321/hello")
            .then(res => {
                console.log("PlayerTile", res);
            });
        }
            
        }>
        <p className="top-1 left-0 font-bold">{ num }</p>
            <img src={ type } alt="Dynamic type" className="relative -bottom-1" />

        </button>
        </>
    )
}