import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { User } from "@boxicons/react";

import Chat from "../components/Chat";
import { useSocketContext } from "../contexts/SocketContext";
import type { Player } from "../../shared/types";
import "../css/Lobby.css";

function Lobby() {
    const MAX_PLAYERS = 8;
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const socket = useSocketContext();

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
        <div className="host-page">
            <div className="lobby">
                <h1 className="game-name">Word Frenzy</h1>
                <h1>
                    {players.length} / {MAX_PLAYERS} | Room Code: {roomCode}
                </h1>
                <div className="players-lobby">
                    {players.map((player) => (
                        <div className="player" key={player.id}>
                            <User />
                            <p className="player-name">{player.name}</p>
                        </div>
                    ))}
                </div>
                <button
                    className={`cta-btn ${players.length > 1 ? "btn-active" : "btn-disabled"}`}
                    onClick={() => {
                        if (players.length > 1) {
                            navigate(`/play/${roomCode}`);
                        }
                    }}>
                    Play
                </button>
            </div>
            <Chat roomCode={roomCode || ""} />
        </div>
    );
}

export default Lobby;
