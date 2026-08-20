import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Bomb from "../components/Bomb";
import Chat from "../components/Chat";
import { useSocketContext } from "../contexts/SocketContext";
import PlayerComponent from "../components/Player";
import type { PlayerData as Player } from "../../shared/interfaces";
import "../css/Play.css";

function Play() {
    const { socket, isConnected } = useSocketContext();
    const { roomCode } = useParams();
    const [players, setPlayers] = useState<Player[]>([]);
    const [isFocusedOnChat, setIsFocusedOnChat] = useState<boolean>(false);

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

    useEffect(() => {
        if (!socket) return;

        socket.on("word_updated", (updatedPlayers: Player[]) => {
            setPlayers(updatedPlayers);
        });

        return () => {
            socket.off("word_updated");
        };
    }, []);

    if (!socket || !isConnected) return;
    if (!roomCode) {
        throw new Error("No room code was assigned to this room.");
    }

    return (
        <div className="play-page">
            <div className="game">
                <div className="players">
                    {players.map((player) => (
                        <PlayerComponent
                            key={player.id}
                            player={player}
                            isFocusedOnChat={isFocusedOnChat}
                        />
                    ))}
                </div>
                <Bomb />
            </div>
            <Chat roomCode={roomCode} setIsFocused={setIsFocusedOnChat} />
        </div>
    );
}

export default Play;
