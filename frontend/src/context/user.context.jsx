import React, { createContext, useState, useContext } from "react";

// Create the User Context
const UserContext = createContext();



// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => { return useContext(UserContext) };

