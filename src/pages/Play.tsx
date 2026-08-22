import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        function updatePlayers(v: Player[]): void {
            setPlayers(v);
        }

        function navigateToWinnerScreen(): void {
            navigate(`/winner/${roomCode}`);
        }

        socket.on("player_joined", updatePlayers);
        socket.on("recieve_players", updatePlayers);
        socket.on("word_updated", updatePlayers);
        socket.on("game_over", navigateToWinnerScreen);
        socket.emit("get_players", roomCode);
        socket.emit("get_current_typer", roomCode);

        return () => {
            socket.off("player_joined", updatePlayers);
            socket.off("recieve_players", updatePlayers);
            socket.off("word_updated", updatePlayers);
            socket.off("game_over", navigateToWinnerScreen);
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
