import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js";
import { useUser } from "../context/user.context.jsx";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

const Project = () => {
    const location = useLocation();
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        } catch (err) {
            console.error("Error adding collaborators:", err);
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
            }
        };

        const fetchUsers = async () => {
            try {
                const { data } = await axios.get("/user/all");
                setUsers(data.users);
            } catch (err) {
                console.error("Error fetching users:", err);
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

                <div className="conversation-area flex-grow flex flex-col overflow-auto max-h-full">
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
                                    {/* Render Markdown with syntax highlighting */}
                                    <div className="overflow-auto max-w-full bg-slate-950 text-white p-2 rounded-md">
                                        <Markdown
                                            className="text-sm break-words"
                                            options={{
                                                forceBlock: true,
                                                overrides: {
                                                    code: {
                                                        component: SyntaxHighlighter,
                                                        props: {
                                                            style: nightOwl, // Dark theme
                                                            language: "javascript", // Adjust language dynamically if necessary
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
            </section>
        </main>
    );
};

export default Project;
