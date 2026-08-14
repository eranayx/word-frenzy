import { useNavigate } from "react-router-dom";

import { User } from "@boxicons/react";

import { usePlayerContext } from "../contexts/PlayerContext";
import Chat from "../components/Chat";
import { generateRoomCode } from "../../shared/utils";
import "../css/Host.css";

function Host() {
    const MAX_PLAYERS = 8;
    const navigate = useNavigate();
    const { players } = usePlayerContext();

    return (
        <div className="host-page">
            <div className="lobby">
                <h1 className="game-name">Word Frenzy</h1>
                <h1>
                    {players.length} / {MAX_PLAYERS} | Room Code:{" "}
                    {generateRoomCode()}
                </h1>
                <div className="players-lobby">
                    {players.map((player, i) => (
                        <div className="player" key={i}>
                            <User />
                            <p className="player-name">{player.name}</p>
                        </div>
                    ))}
                </div>
                <button
                    className="start-btn"
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

export default Host;
