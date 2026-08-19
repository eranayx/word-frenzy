import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";

type GameContextType = {
    rawTime: number;
    formattedTime: string;
    substring: string;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = (): GameContextType => {
    const context = useContext(GameContext);

    if (context === undefined) {
        throw new Error("useGameContext must be used within a GameProvider");
    }

    return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [rawTime, setRawTime] = useState<number>(0);
    const [formattedTime, setFormattedTime] = useState<string>("0:00");
    const [substring, setSubstring] = useState<string>("?");
    const { socket, isConnected } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        function handleTime(rawTime: number, formattedTime: string) {
            setRawTime(rawTime);
            setFormattedTime(formattedTime);
        }

        function handleSubstring(value: string): void {
            setSubstring(value);
        }

        socket.on("update_time", handleTime);
        socket.on("recieved_substring", handleSubstring);

        return () => {
            socket.off("update_time", handleTime);
            socket.off("recieved_word", handleSubstring);
        };
    }, []);

    if (!socket || !isConnected) return;

    const value: GameContextType = {
        rawTime,
        formattedTime,
        substring,
    };
    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};
