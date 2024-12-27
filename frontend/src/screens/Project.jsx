import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Project = () => {
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const location = useLocation();
    console.log(location.state);

    // Sample users data
    const users = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
        { id: 3, name: 'User 3', email: 'user3@example.com' },
        { id: 4, name: 'User 4', email: 'user4@example.com' },
        { id: 5, name: 'User 5', email: 'user5@example.com' },
        { id: 6, name: 'User 6', email: 'user6@example.com' },
        { id: 7, name: 'User 7', email: 'user7@example.com' },
    ];

    const handleUserClick = (user) => {
        setSelectedUsers((prevSelectedUsers) => {
            // Toggle selection: add if not selected, remove if selected
            if (prevSelectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
                return prevSelectedUsers.filter((selectedUser) => selectedUser.id !== user.id);
            } else {
                return [...prevSelectedUsers, user];
            }
        });
    };

    return (
        <main className="h-screen w-screen flex flex-col md:flex-row">
            {/* Sidebar Section */}
            <section className="relative bg-slate-300 flex flex-col h-full md:w-1/3 lg:w-1/4">
                <header className="flex justify-between items-center p-2 px-4 bg-slate-200 cursor-pointer">
                    <button
                        className="flex gap-2"
                        onClick={() => setIsModalOpen(true)}  // Open modal when button is clicked
                    >
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button
                        onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                        className="p-2"
                    >
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
                    className={`absolute top-0 left-0 transform transition-transform duration-300 w-full h-full bg-slate-500 z-10 flex flex-col gap-2 ${
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

            {/* Modal for selecting collaborators */}
            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
                    <div className="modal-content bg-white p-4 rounded-lg w-80 md:w-96">
                        <header className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">Select Collaborator</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-black text-xl"
                            >
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        {/* Scrollable User List */}
                        <div className="user-list mt-4 space-y-3 max-h-60 overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className={`user cursor-pointer flex items-center gap-2 p-2 rounded-md ${
                                        selectedUsers.some((selectedUser) => selectedUser.id === user.id)
                                            ? 'bg-slate-400'  // Highlight selected user
                                            : ''
                                    }`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-slate-300">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.name}</h1>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                disabled={selectedUsers.length === 0} // Button enabled only if at least one user is selected
                            >
                                Add Collaborator
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Project;
