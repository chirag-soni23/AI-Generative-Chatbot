import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios.js';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';
import { useUser } from '../context/user.context.jsx';

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [project, setProject] = useState(location.state.project);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useUser();
    const messageBox = useRef(null);

    const scrollToBottom = () => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    };

    const addCollaborators = () => {
        axios
            .put('/project/add-user', {
                projectId: location.state.project._id,
                users: selectedUsers.map((user) => user._id),
            })
            .then(() => setIsModalOpen(false))
            .catch((err) => console.error('Error adding collaborators:', err));
    };

    const handleUserClick = (clickedUser) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.some((user) => user._id === clickedUser._id)
                ? prevSelected.filter((user) => user._id !== clickedUser._id)
                : [...prevSelected, clickedUser]
        );
    };

    const sendMessageHandler = () => {
        if (!message.trim()) return;

        const newMessage = {
            sender: user._id,
            message,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessage('project-message', newMessage);
        setMessage('');
    };

    const appendIncomingMessage = (messageObject) => {
        setMessages((prevMessages) => [...prevMessages, messageObject]);
    };

    useEffect(() => {
        const socketInstance = initializeSocket(project._id);

        receiveMessage('project-message', (data) => {
            appendIncomingMessage(data);
        });

        axios
            .get(`/project/get-project/${location.state.project._id}`)
            .then((res) => setProject(res.data.project))
            .catch((err) => console.error('Error fetching project:', err));

        axios
            .get('/user/all')
            .then((res) => setUsers(res.data.users))
            .catch((err) => console.error('Error fetching users:', err));

        return () => {
            if (socketInstance) socketInstance.disconnect();
        };
    }, [project._id]);

    useEffect(scrollToBottom, [messages]);

    return (
        <main className="h-screen w-screen flex flex-col md:flex-row">
            <section className="relative bg-slate-300 flex flex-col h-full md:w-1/3 lg:w-1/4">
                <header className="flex justify-between items-center p-2 px-4 bg-slate-200">
                    <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill mr-1"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2">
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                <div className="conversation-area flex-grow flex flex-col overflow-auto max-h-full">
                    <div ref={messageBox} className="message-box flex-grow flex flex-col gap-3 overflow-y-auto p-2 pb-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message flex flex-col max-w-52 gap-1 p-2 rounded-md ${
                                    msg.sender === user._id ? 'bg-slate-200 ml-auto' : 'bg-slate-50'
                                }`}
                            >
                                <small className="opacity-65 text-xs">
                                    {msg.sender === user._id ? 'You' : project.users.find((u) => u._id === msg.sender)?.email}
                                </small>
                                <p className="text-sm break-words">{msg.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full input-box flex items-center p-2 bg-white border-t">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-grow p-2 px-4 border-none outline-none text-sm"
                            type="text"
                            placeholder="Enter message"
                        />
                        <button onClick={sendMessageHandler} className="p-2 text-blue-500">
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>

                <div
                    className={`absolute top-0 left-0 transform transition-transform duration-300 w-full h-full bg-slate-500 z-10 flex flex-col gap-2 ${
                        isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <header className="flex justify-between items-center bg-slate-200 px-3 py-2">
                        <h1 className="font-semibold text-lg">Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(false)} className="text-black text-xl p-2">
                            <i className="ri-close-fill"></i>
                        </button>
                    </header>

                    <div className="users flex flex-col gap-3 p-4">
                        {project.users?.map((user, index) => (
                            <div key={index} className="user flex items-center gap-2 p-2 rounded-md">
                                <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-slate-300">
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className="font-semibold text-lg">{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
                    <div className="modal-content bg-white p-4 rounded-lg w-80 md:w-96">
                        <header className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">Select Collaborator</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-black text-xl">
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="user-list mt-4 space-y-3 max-h-60 overflow-y-auto">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className={`user flex items-center gap-2 p-2 rounded-md ${
                                        selectedUsers.some((u) => u._id === user._id) ? 'bg-slate-400' : ''
                                    }`}
                                    onClick={() => handleUserClick(user)}
                                >
                                    <div className="aspect-square w-10 h-10 rounded-full flex items-center justify-center bg-slate-300">
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <h1 className="font-semibold text-lg">{user.email}</h1>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={addCollaborators}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                disabled={!selectedUsers.length}
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
