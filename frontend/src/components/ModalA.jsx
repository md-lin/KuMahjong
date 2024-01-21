


export default function ModalA({closeModal}) {

    return (
        <>
            <div id="modal-semi-transparent-bg" className="text-white bg-black font-bold bg-opacity-75 h-full w-full p-10 fixed left-0 top-0 z-[1]">
                <div id="actual-modal" className="bg-primary m-auto py-8 px-10 w-4/5 rounded-xl">
                <h1 className="text-3xl">Question!</h1>

                <span className="m-5 h-64 overflow-x-hidden overflow-y-auto inline-block align-bottom">What is the only food that cannot go bad?</span>

                {/* Buttons */}
                <ul className="space-y-3">
                    <li><button id="modal-a" onClick={() => closeModal(false)} className="h-16 w-full bg-purple rounded-xl border-r-white border-2 hover:bg-black duration-150">
                        <ul className="flex">
                            <li className="px-6">A</li>
                            <li className=" px-6">Dark chocolate</li>
                            </ul>
                        </button>
                    </li>
                    <li><button id="modal-b" onClick={() => closeModal(false)} className="h-16 w-full bg-blue rounded-xl border-r-white border-2 hover:bg-black duration-150">
                        <ul className="flex">
                            <li className="px-6">B</li>
                            <li className=" px-6">Peanut butter</li>
                            </ul>
                        </button>
                    </li>
                    <li><button id="modal-c" onClick={() => closeModal(false)} className="h-16 w-full bg-yellow rounded-xl border-r-white border-2 hover:bg-black duration-150">
                        <ul className="flex">
                            <li className="px-6">C</li>
                            <li className=" px-6">Canned tuna</li>
                            </ul>
                        </button>
                    </li>
                    <li><button id="modal-d" onClick={() => closeModal(false)} className="h-16 w-full bg-red rounded-xl border-r-white border-2 hover:bg-black duration-150">
                    <ul className="flex">
                            <li className="px-6">D</li>
                            <li className=" px-6">Honey</li>
                            </ul>    
                        </button>
                    </li>
                </ul>
                </div>
                
            </div>
        </>
        
    )
}