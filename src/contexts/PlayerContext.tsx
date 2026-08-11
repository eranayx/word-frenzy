import { createContext, useContext, useState } from "react";

export type Player = {
    name: string;
    id: number;
};

type PlayerContextType = {
    players: Player[];
    addPlayer: (player: Player) => void;
    removePlayer: (playerID: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = (): PlayerContextType => {
    const context = useContext(PlayerContext);

    if (context === undefined) {
        throw new Error(
            "usePlayerContext must be used within a PlayerProvider",
        );
    }

    return context;
};

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [players, setPlayers] = useState<Player[]>([]);

    const addPlayer = (player: Player): void => {
        setPlayers((prev) => [...prev, player]);
    };

    const removePlayer = (playerID: number): void => {
        setPlayers((prev) => prev.filter((player) => player.id !== playerID));
    };

    const value: PlayerContextType = {
        players,
        addPlayer,
        removePlayer,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};
