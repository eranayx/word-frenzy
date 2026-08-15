import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { io, Socket } from "socket.io-client";
import { User } from "@boxicons/react";

import Chat from "../components/Chat";
import type { Player } from "../../shared/interfaces";
import "../css/Lobby.css";

function Lobby() {
    const MAX_PLAYERS = 8;
    const navigate = useNavigate();

    const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL);
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    const location = useLocation();
    const [players, setPlayers] = useState<Player[]>([
        location.state?.initialPlayers,
    ]);
    useEffect(() => {
        const socket = socketRef.current;
        if (socket === null) return;

        function updatePlayers(data: Player[]): void {
            console.log("hello world");
            console.log(data.map((p) => p.name));
            setPlayers(data);
        }

        socket.on("player_joined", updatePlayers);

        return () => {
            socket.off("player_joined", updatePlayers);
        };
    }, []);

    const { roomId } = useParams();

    return (
        <div className="host-page">
            <div className="lobby">
                <h1 className="game-name">Word Frenzy</h1>
                <h1>
                    {players.length} / {MAX_PLAYERS} | Room Code: {roomId}
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
                    className="cta-btn"
                    onClick={() => {
                        navigate("/play");
                    }}>
                    Play
                </button>
            </div>
            <Chat />
        </div>
    );
}

export default Lobby;
