import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { io, type Socket } from "socket.io-client";

import { generateRoomCode } from "../../shared/utils";
import { type Player } from "../../shared/interfaces";
import "../css/Home.css";
import { getJoinableRoomCode } from "../../server/services/rooms";

function Home() {
    const [name, setName] = useState<string>("");
    const [roomCode, setRoomCode] = useState<string>("");
    const [joiningRoom, setJoiningRoom] = useState<boolean>(false);
    const navigate = useNavigate();

    const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL);
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    function handlePlay(): void {
        if (!name) {
            return;
        }
        if (!socketRef.current || !socketRef.current.id) return;

        const player: Player = {
            name: name,
            id: socketRef.current.id,
        };

        const code = getJoinableRoomCode() || generateRoomCode();
        socketRef.current.emit("add_player", { player, code });
        navigate("/play");
    }

    function handleHost(): void {
        if (!name || !socketRef.current || !socketRef.current.id) return;
        const player: Player = {
            name: name,
            id: socketRef.current.id,
        };

        const code = generateRoomCode();
        socketRef.current.emit("add_player", player, code);
        navigate(`/lobby/${code}`, { state: { initialPlayers: player } });
    }

    function handleJoin(): void {
        if (!name) return;
        if (!joiningRoom) {
            const nameForm = document.getElementById("name-form");
            const roomCodeForm = document.getElementById("room-code-form");
            const playBtn = document.getElementById("play-btn");
            const hostBtn = document.getElementById("host-btn");
            const backBtn = document.getElementById("back-btn");
            const HIDDEN = "hidden";

            nameForm?.classList.add(HIDDEN);
            roomCodeForm?.classList.remove(HIDDEN);
            playBtn?.classList.add(HIDDEN);
            hostBtn?.classList.add(HIDDEN);
            backBtn?.classList.remove(HIDDEN);

            setJoiningRoom(true);
            return;
        }

        // check if valid room code

        if (!roomCode) return;
        if (!socketRef.current || !socketRef.current.id) return;
        const player: Player = {
            name: name,
            id: socketRef.current.id,
        }
        socketRef.current.emit("add_player", player, roomCode);
        navigate(`/lobby/${roomCode}`);
    }

    function handleBack(): void {
        const nameForm = document.getElementById("name-form");
        const roomCodeForm = document.getElementById("room-code-form");
        const playBtn = document.getElementById("play-btn");
        const hostBtn = document.getElementById("host-btn");
        const backBtn = document.getElementById("back-btn");
        const HIDDEN = "hidden";

        nameForm?.classList.remove(HIDDEN);
        roomCodeForm?.classList.add(HIDDEN);
        playBtn?.classList.remove("hidden");
        hostBtn?.classList.remove("hidden");
        backBtn?.classList.add("hidden");

        setJoiningRoom(false);
    }

    return (
        <div className="hero">
            <div className="hero-text">
                <h1 className="hero-title">Word Frenzy</h1>
                <p className="subtext">A unique twist on an iconic game</p>
            </div>
            <div className="cta">
                <form id="name-form" className="cta-form">
                    <label className="cta-label" htmlFor="name">
                        Enter name:{" "}
                    </label>
                    <input
                        id="name"
                        className="cta-input"
                        type="text"
                        name="name"
                        autoComplete="off"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </form>
                <form id="room-code-form" className="cta-form hidden">
                    <label className="cta-label" htmlFor="name">
                        Enter room code:{" "}
                    </label>
                    <input
                        id="room-code"
                        className="cta-input"
                        type="text"
                        name="room-code"
                        autoComplete="off"
                        onChange={(e) => {
                            setRoomCode(e.target.value);
                        }}
                    />
                </form>
                <div className="cta-btn-container">
                    <div className="main-menu">
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
                        <button
                            id="back-btn"
                            className="cta-btn hidden"
                            onClick={handleBack}>
                            Back
                        </button>
                        <button
                            id="join-btn"
                            className="cta-btn"
                            onClick={handleJoin}>
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
