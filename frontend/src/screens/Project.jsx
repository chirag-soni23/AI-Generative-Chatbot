import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js";
import { useUser } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from 'react-hot-toast';

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal open state for adding collaborators
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [project, setProject] = useState(location.state.project || {});
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { user } = useUser();
    const messageBox = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (messageBox.current) {
            messageBox.current.scrollTop = messageBox.current.scrollHeight;
        }
    }, []);

    const addCollaborators = async () => {
        try {
            await axios.put("/project/add-user", {
                projectId: project._id,
                users: selectedUsers.map((user) => user._id),
            });
            setIsModalOpen(false);
            setSelectedUsers([]);  // Reset selected users after adding them

            // Show success toast
            toast.success("Collaborators added successfully!");
        } catch (err) {
            console.error("Error adding collaborators:", err);

            // Show error toast
            toast.error("Failed to add collaborators. Try again!");
        }
    };

    const handleUserClick = useCallback(
        (clickedUser) => {
            setSelectedUsers((prevSelected) =>
                prevSelected.some((user) => user._id === clickedUser._id)
                    ? prevSelected.filter((user) => user._id !== clickedUser._id)
                    : [...prevSelected, clickedUser]
            );
        },
        [setSelectedUsers]
    );

    const sendMessageHandler = () => {
        if (!message.trim()) return;

        const newMessage = {
            sender: user._id,
            message,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        sendMessage("project-message", newMessage);
        setMessage("");

        // Show success toast for sending message
        toast.success("Message sent successfully!");
    };

    const appendIncomingMessage = useCallback((messageObject) => {
        setMessages((prevMessages) => [...prevMessages, messageObject]);
    }, []);

    useEffect(() => {
        const socketInstance = initializeSocket(project._id);

        receiveMessage("project-message", appendIncomingMessage);

        const fetchProjectDetails = async () => {
            try {
                const { data } = await axios.get(`/project/get-project/${project._id}`);
                setProject(data.project);
            } catch (err) {
                console.error("Error fetching project:", err);

                // Show error toast
                toast.error("Failed to fetch project details!");
            }
        };

        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("/user/all");
                setUsers(data.users);
            } catch (err) {
                console.error("Error fetching users:", err);

                // Show error toast
                toast.error("Failed to fetch users!");
            }
        };

        fetchProjectDetails();
        fetchUsers();

        return () => {
            if (socketInstance) socketInstance.disconnect();
        };
    }, [project._id, appendIncomingMessage]);

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

                <div className={`conversation-area flex-grow flex flex-col overflow-auto max-h-full`}>
                    {/* Messages */}
                    <div ref={messageBox} className="message-box flex-grow flex flex-col gap-3 overflow-y-auto p-2 pb-3">
                        {messages.map((msg, index) => {
                            const senderEmail =
                                msg.sender === "ai"
                                    ? "ai@example.com"
                                    : msg.sender === user._id
                                    ? "You"
                                    : project?.users?.find((u) => u._id === msg.sender)?.email || "AI";

                            return (
                                <div
                                    key={index}
                                    className={`message flex flex-col max-w-full gap-1 p-2 rounded-md ${
                                        msg.sender === user._id ? "bg-slate-200 ml-auto" : "bg-slate-50"
                                    }`}
                                >
                                    <small className="opacity-65 text-xs">{senderEmail}</small>
                                    <div className="overflow-auto max-w-full bg-slate-950 text-white p-2 rounded-md">
                                        <Markdown
                                            className="text-sm break-words"
                                            options={{
                                                forceBlock: true,
                                                overrides: {
                                                    code: {
                                                        component: SyntaxHighlighter,
                                                        props: {
                                                            style: nightOwl,
                                                            language: "javascript",
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            {msg.message}
                                        </Markdown>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Message Input */}
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

            {/* Side Panel for Collaborators */}
            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${
                    isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ width: "250px" }}
            >
                <header className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold">Current Collaborators</h3>
                    <button onClick={() => setIsSidePanelOpen(false)}>
                        <i className="ri-close-fill"></i>
                    </button>
                </header>
                <div className="flex flex-col p-4">
                    {project?.users?.map((userItem) => (
                        <div key={userItem._id} className="flex items-center gap-2">
                            <i className="ri-user-fill"></i>
                            <span>{userItem.email}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Collaborators Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Select Users to Add</h2>
                        <div className="space-y-4">
                            {users.map((userItem) => (
                                <div
                                    key={userItem._id}
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => handleUserClick(userItem)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.some((u) => u._id === userItem._id)}
                                        onChange={() => {}}
                                    />
                                    <span>{userItem.email}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-4">
                            <button
                                onClick={addCollaborators}
                                className="w-full bg-blue-500 text-white py-2 rounded-md"
                            >
                                Add Collaborators
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full bg-red-500 text-white py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </section>
        </main>
    );
};

export default Project;
