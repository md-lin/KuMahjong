import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Game from './components/Game'
import ModalA from './components/ModalA'
import ModalB from './components/ModalB'
import EndModal from './components/EndModal'
import MahjongImg from './assets/icon_mahjong_tile.png'
import './App.css'

function App() {

  const [openModal, setOpenModal] = useState(false)
  const [openModalB, setOpenModalB] = useState(false)
  const [endOpenModal, setEndOpenModal] = useState(false)

  return (
    <>
    <div id="title" className='p-5 flex space-x-2'>
      <h1 className='font-bold text-2xl text-white'>KuMahjong</h1>
      <img src={ MahjongImg } alt="Tile" className='h-8' />
    </div>
    <Game playerName={"Player"} enemy1={"Friend 1"} enemy2={"Friend 2"} enemy3={"Friend 3"} />
    <div id="chow_pung" className='text-white font-bold mx-12 my-5'>
      <ul className='flex space-x-3'>
        <li><button id="chow" onClick={() => {
          setOpenModal(true);
        }} className=' shadow-1 bg-purple rounded-lg py-2 px-4 hover:bg-black hover:shadow-2 duration-300'>Chow</button></li>
        <li><button id="pung" onClick={() => {
          setOpenModalB(true);
        }} className='shadow-1 bg-blue rounded-lg py-2 px-4 hover:bg-black hover:shadow-2 duration-300'>Pung</button></li>
        <li><button id="mahjong" onClick={() => {
          setEndOpenModal(true);
        }} className='shadow-1 bg-red rounded-lg py-2 px-4 hover:bg-black hover:shadow-2 hover:text-red duration-300'>Mahjong</button></li>
      </ul>
      
      
      
    </div>
    
    {openModal && <ModalA closeModal={setOpenModal} />}
    {openModalB && <ModalB closeModalB={setOpenModalB} />}
    {endOpenModal && <EndModal endCloseModal={setEndOpenModal} />}

    </>
  )
}

export default App
