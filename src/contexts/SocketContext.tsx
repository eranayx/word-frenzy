import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null | undefined>(undefined);

export const useSocketContext = (): Socket | null => {
    const context = useContext(SocketContext);

    if (context === undefined) {
        throw new Error("useGameContext must be used within a GameProvider");
    }

    return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null); // useState, not useRef

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SERVER_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
