import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { User } from "@boxicons/react";

import Chat from "../components/Chat";
import { useSocketContext } from "../contexts/SocketContext";
import { MAX_LOBBY_SIZE } from "../../shared/constants";
import type { PlayerData as Player } from "../../shared/interfaces";
import "../css/Lobby.css";

function Lobby() {
    const [player, setPlayer] = useState<Player>();
    const [playersList, setPlayersList] = useState<Player[]>([]);
    const navigate = useNavigate();
    const { roomCode } = useParams();
    const { socket, isConnected } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const getPlayer = async (): Promise<void> => {
            const player: Player = await socket.emitWithAck(
                "get_current_player",
                socket.id,
            );

            setPlayer(player);
        };

        getPlayer();
    }, []);

    useEffect(() => {
        if (!socket) return;

        function updatePlayers(data: Player[]): void {
            setPlayersList(data);
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

        function handleStartGame(): void {
            navigate(`/play/${roomCode}`);
        }

        socket.on("start_game", handleStartGame);

        return () => {
            socket.off("start_game", handleStartGame);
        };
    }, []);

    if (!socket || !isConnected) return;

    return (
        <div className="host-page">
            <div className="lobby">
                <h1 className="game-name">Word Frenzy</h1>
                <h1>
                    {playersList.length} / {MAX_LOBBY_SIZE} | Room Code:{" "}
                    {roomCode}
                </h1>
                <div className="players-lobby">
                    {playersList.map((player) => (
                        <div className="player" key={player.id}>
                            <User />
                            <p className="player-name">{player.name}</p>
                        </div>
                    ))}
                </div>
                {player?.role === "host" ? (
                    <button
                        className={`cta-btn ${playersList.length > 1 ? "btn-active" : "btn-disabled"}`}
                        onClick={() => {
                            if (playersList.length > 1) {
                                socket.emit("start_game", roomCode);
                            }
                        }}>
                        Play
                    </button>
                ) : (
                    <></>
                )}
            </div>
            <Chat roomCode={roomCode || ""} />
        </div>
    );
}

export default Lobby;
