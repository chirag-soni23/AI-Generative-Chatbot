import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Project = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const location = useLocation();
    console.log(location.state);

    return (
        <main className="h-screen w-screen flex flex-col md:flex-row">
            {/* Sidebar Section */}
            <section className="relative bg-slate-300 flex flex-col h-full md:w-1/3 lg:w-1/4">
                <header
                    onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                    className="flex justify-end p-2 px-4 bg-slate-200 cursor-pointer"
                >
                    <button className="p-2">
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                {/* Conversation Area */}
                <div className="conversation-area flex flex-grow flex-col">
                    {/* Message Box */}
                    <div className="message-box flex-grow flex flex-col gap-3 overflow-y-auto p-2">
                        {/* Incoming Message */}
                        <div className="incoming-message flex flex-col max-w-xs gap-1 p-2 bg-slate-50 w-fit rounded-md">
                            <small className="opacity-65 text-xs">example@gmail.com</small>
                            <p className="text-sm break-words">Hello, How are you?</p>
                        </div>

                        {/* Outgoing Message */}
                        <div className="outgoing-message flex flex-col max-w-xs ml-auto gap-1 p-2 bg-slate-200 w-fit rounded-md">
                            <small className="opacity-65 text-xs">example@gmail.com</small>
                            <p className="text-sm break-words">Hey, I am fine.</p>
                        </div>
                    </div>

                    {/* Input Box */}
                    <div className="w-full input-box flex items-center p-2 bg-white border-t">
                        <input
                            className="flex-grow p-2 px-4 border-none outline-none text-sm"
                            type="text"
                            placeholder="Enter message"
                        />
                        <button className="p-2 text-blue-500">
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div
                    className={`absolute top-0 left-0 transform transition-transform duration-300 w-full h-full bg-red-500 z-10 flex flex-col gap-2 ${
                        isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Close Button */}
                    <header className="flex justify-end bg-slate-200 px-3 py-2">
                        <button
                            onClick={() => setIsSidePanelOpen(false)}
                            className="text-black text-xl p-2"
                        >
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    {/* User List */}
                    <div className="users flex flex-col gap-3 p-4">
                        {/* User 1 */}
                        <div className="user cursor-pointer hover:bg-slate-400 flex items-center gap-2 p-2 rounded-md">
                            <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-slate-300">
                                <i className="ri-user-fill"></i>
                            </div>
                            <h1 className="font-semibold text-lg text-white">Username</h1>
                        </div>

                        {/* User 2 */}
                        <div className="user cursor-pointer hover:bg-slate-400 flex items-center gap-2 p-2 rounded-md">
                            <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-slate-300">
                                <i className="ri-user-fill"></i>
                            </div>
                            <h1 className="font-semibold text-lg text-white">User 2</h1>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Project;
