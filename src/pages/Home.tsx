import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSocketContext } from "../contexts/SocketContext";
import { generateRoomCode } from "../../shared/utils";
import { Player } from "../../shared/types";
import "../css/Home.css";

function Home() {
    const [name, setName] = useState<string>("");
    const [roomCode, setRoomCode] = useState<string>("");
    const { socket, isConnected } = useSocketContext();
    const navigate = useNavigate();

    function generatePlayer(role: "host" | "player"): Player | null {
        if (!name || !socket || !socket.id) {
            return null;
        }

        return new Player(name, socket.id, role);
    }

    async function handlePlay(): Promise<void> {
        const player = generatePlayer("player");
        if (!socket || !player) return;

        const code: string | null = await socket.emitWithAck(
            "get_joinable_room_code",
        );
        if (code === null) return;

        player.current_room = code;
        socket.emit("add_player", { player, code });
        navigate(`/play/${code}`);
    }

    function handleHost(): void {
        const player = generatePlayer("host");
        if (!socket || !player) return;

        const code = generateRoomCode();

        player.current_room = code;
        socket.emit("add_player", player, code);
        navigate(`/lobby/${code}`);
    }

    const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
    async function handleJoin(): Promise<void> {
        if (!socket || !name) return;
        if (!isJoiningRoom) {
            setRoomCode("");
            setIsJoiningRoom(true);
            return;
        }
        if (!roomCode) return;

        const isValid: boolean = await socket.emitWithAck(
            "check_valid_code",
            roomCode,
        );
        if (!isValid) return;

        const player = generatePlayer("player");
        if (!player) return;

        player.current_room = roomCode;
        socket.emit("add_player", player, roomCode);
        navigate(`/lobby/${roomCode}`);
    }

    function handleBack(): void {
        setIsJoiningRoom(false);
    }

    if (!socket || !isConnected) return;

    return (
        <div className="hero">
            <div className="hero-text">
                <h1 className="hero-title">Word Frenzy</h1>
                <p className="subtext">A unique twist on an iconic game</p>
            </div>
            <div className="cta">
                {isJoiningRoom ? (
                    <form
                        id="room-code-form"
                        className="cta-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleJoin();
                        }}>
                        <label className="cta-label" htmlFor="room-code">
                            Enter room code:{" "}
                        </label>
                        <input
                            id="room-code"
                            className="cta-input"
                            type="text"
                            name="room-code"
                            autoComplete="off"
                            value={roomCode}
                            onChange={(e) => {
                                setRoomCode(e.target.value);
                            }}
                        />
                    </form>
                ) : (
                    <form
                        id="name-form"
                        className="cta-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handlePlay();
                        }}>
                        <label className="cta-label" htmlFor="name">
                            Enter name:{" "}
                        </label>
                        <input
                            id="name"
                            className="cta-input"
                            type="text"
                            name="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </form>
                )}

                <div className="cta-btn-container">
                    {isJoiningRoom ? (
                        <button
                            id="back-btn"
                            className="cta-btn"
                            onClick={handleBack}>
                            Back
                        </button>
                    ) : (
                        <>
                            <button
                                id="play-btn"
                                className="cta-btn"
                                onClick={handlePlay}>
                                Play
                            </button>
                            <button
                                id="host-btn"
                                className="cta-btn"
                                onClick={handleHost}>
                                Host
                            </button>
                        </>
                    )}
                    <button
                        id="join-btn"
                        className="cta-btn"
                        onClick={handleJoin}>
                        Join
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
