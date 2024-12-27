import socket from 'socket.io-client';

let socketInstance = null;


// initialize socket
export const initializeSocket = () =>{
    socketInstance = socket(import.meta.env.VITE_API_URI,{
        auth:{
            token: localStorage.getItem('token')
        }
    });
    return socketInstance;
};

// receive message
export const receiveMessage = (eventName,data)=>{
    socketInstance.emit(eventName,data)
};