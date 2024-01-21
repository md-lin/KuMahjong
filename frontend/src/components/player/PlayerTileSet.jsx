import PlayerTile from "./PlayerTile"

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


export default function PlayerTileSet() {
    return (
        <>
        <ul className="flex space-x-1 p-4 bg-[#6E605A] m-2 w-[75rem] rounded-2xl shadow-1">
            <li><PlayerTile num="2" type={ Sauder } /></li>
            <li><PlayerTile num="3" type={ Sauder } /></li>
            <li><PlayerTile num="4" type={ Sauder } /></li>
            <li><PlayerTile num="4" type={ Sauder } /></li>
            <li><PlayerTile num="9" type={ Sauder } /></li>
            <li><PlayerTile num="1" type={ Eng } /></li>
            <li><PlayerTile num="6" type={ Eng } /></li>
            <li><PlayerTile num="1" type={ Cs } /></li>
            <li><PlayerTile num="1" type={ Cs } /></li>
            <li><PlayerTile num="1" type={ Cs } /></li>
            <li><PlayerTile num="3" type={ Cs } /></li>
            <li><PlayerTile type={ birdA } /></li>
            <li><PlayerTile type={ birdA } /></li>
            <li><PlayerTile type={ moonC } /></li>
        </ul>
        </>
    )
}