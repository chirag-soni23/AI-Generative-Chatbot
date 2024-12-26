import React from 'react';
import { useLocation } from 'react-router-dom';

const Project = () => {
    const location = useLocation();
    console.log(location.state);

    return (
        <main className="h-screen w-screen flex flex-col md:flex-row">
            {/* Sidebar Section */}
            <section className="left bg-slate-300 flex flex-col h-full md:w-1/3 lg:w-1/4">
                <header className="flex justify-end p-2 px-4 bg-slate-200">
                    <button className="p-2">
                        <i className="ri-group-fill"></i>
                    </button>
                </header>
                <div className="conversation-area flex flex-grow flex-col">
                    {/* Message Box */}
                    <div className="message-box flex-grow flex flex-col gap-3 overflow-y-auto p-2">
                        {/* Incoming Message */}
                        <div className="incoming-message flex flex-col max-w-56 gap-1 p-2 bg-slate-50 w-fit rounded-md">
                            <small className="opacity-65 text-xs">example@gmail.com</small>
                            <p className="text-sm break-words">
                               Hello, How Are you?
                            </p>
                        </div>
                        {/* Outgoing Message */}
                        <div className="incoming-message flex flex-col max-w-56 ml-auto gap-1 p-2 bg-slate-50 w-fit rounded-md">
                            <small className="opacity-65 text-xs">example@gmail.com</small>
                            <p className="text-sm break-words">
                                Hey, I am fine.
                            </p>
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
            </section>
        </main>
    );
};

export default Project;
