import socket from 'socket.io-client';

let socketInstance = null;


// initialize socket
export const initializeSocket = (projectId) =>{
    socketInstance = socket(import.meta.env.VITE_API_URI,{
        auth:{
            token: localStorage.getItem('token')
        },
        query:{
            projectId
        }
    });
    return socketInstance;
};

// receive message
export const receiveMessage = (eventName,cb)=>{
    if (socketInstance) {
        socketInstance.on(eventName, cb); 
    }
};

// send message
export const sendMessage = (eventName,data)=>{
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};