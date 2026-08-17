import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Bomb from "../components/Bomb";
import Chat from "../components/Chat";
import { useSocketContext } from "../contexts/SocketContext";
import PlayerComponent from "../components/Player";
import type { Player } from "../../shared/types";
import "../css/Play.css";

function Play() {
    const socket = useSocketContext();
    const { roomCode } = useParams();

    const [players, setPlayers] = useState<Player[]>([]);
    useEffect(() => {
        if (!socket) return;

        function updatePlayers(data: Player[]): void {
            setPlayers(data);
        }

        socket.on("player_joined", updatePlayers);
        socket.once("recieve_players", updatePlayers);
        socket.emit("get_players", roomCode);

        return () => {
            socket.off("player_joined", updatePlayers);
        };
    }, []);

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
            <Chat roomCode={roomCode || ""} />
        </div>
    );
}

export default Play;
