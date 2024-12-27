import socket from 'socket.io-client';

let socketInstance = null;

export const initializeSocket = () =>{
    socketInstance = socket(import.meta.env.VITE_API_URI,{
        auth:{
            token: localStorage.getItem('token')
        }
    });
    return socketInstance;
}