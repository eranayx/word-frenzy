import { useEffect, useRef, useState } from "react";

import { io, type Socket } from "socket.io-client";

import Bomb from "../components/Bomb";
import Chat from "../components/Chat";
import PlayerComponent from "../components/Player";
import type { Player } from "../../shared/interfaces";
import "../css/Play.css";

function Play() {
    const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL);
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    const [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        const socket = socketRef.current;
        if (socket === null) return;

        function handlePlayerJoined(data: Player[]): void {
            setPlayers(data);
        }

        socket.on("player_joined", handlePlayerJoined);

        return () => {
            socket.off("player_joined", handlePlayerJoined);
        };
    });

    return (
        <div className="play-page">
            <div className="game">
                <div className="players">
                    {players.map((player) => (
                        <PlayerComponent key={player.id} name={player.name} />
                    ))}
                </div>
                <Bomb />
            </div>
            <Chat />
        </div>
    );
}

export default Play;
