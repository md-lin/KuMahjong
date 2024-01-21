
export default function EndModal({endCloseModal}) {

    return (
        <>
            <div id="modal-semi-transparent-bg" className="text-white bg-black font-bold bg-opacity-75 h-full w-full p-10 fixed left-0 top-0 z-[1]">
                <div id="actual-modal" className="bg-primary m-auto py-8 px-10 w-4/5 rounded-xl">
                <h1 className="text-3xl">Question!</h1>

                <span className="m-5 h-64 overflow-x-hidden overflow-y-auto inline-block align-bottom">Lorem ipsum dolor sit amet.</span>

                {/* Buttons */}
                <ul className="space-x-3 flex">
                    <li><button id="modal-a" onClick={() => endCloseModa(false)} className="h-16 w-[33rem] p-3 bg-red rounded-xl border-r-white border-2 hover:bg-black duration-150">Exit</button></li>
                    <li><button id="modal-b" onClick={() => endCloseModal(false)} className="h-16 w-[33rem] p-3 bg-blue rounded-xl border-r-white border-2 hover:bg-black duration-150">Start Another Game</button></li>
                </ul>
                </div>
                
            </div>
        </>
        
    )
}