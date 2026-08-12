import { createContext, useContext, useEffect, useState } from "react";
import { generateRandomString } from "../services/api";

type GameContextType = {
    time: number;
    resetTime: () => void;
    substring: string;
    changeSubstring: () => void;
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
    const TIME_LIMIT = 10;
    const [time, setTime] = useState<number>(0);
    const resetTime = () => {
        setTime(TIME_LIMIT);
    };

    const [substring, setSubstring] = useState<string>("");
    const changeSubstring = async () => {
        let response: string[] = [];

        try {
            response = await generateRandomString();
        } catch (err) {
            console.log(err);
        }

        const word = response[0];
        const NUM_LETTERS = 2;
        const randomStart = Math.floor(
            Math.random() * (word.length - NUM_LETTERS),
        );

        setSubstring(word.slice(randomStart, randomStart + NUM_LETTERS));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => (prev > 0 ? prev - 1 : TIME_LIMIT));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (time === 0) {
            changeSubstring();
        }
    }, [time]);

    const value: GameContextType = {
        time,
        resetTime,
        substring,
        changeSubstring,
    };
    return (
        <GameContext.Provider value={value}>{children}</GameContext.Provider>
    );
};
