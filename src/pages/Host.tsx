import { useNavigate } from "react-router-dom";

import { User } from "@boxicons/react";

import { usePlayerContext } from "../contexts/PlayerContext";
import "../css/Host.css";

function Host() {
    const MAX_PLAYERS = 8;
    const navigate = useNavigate();
    const { players } = usePlayerContext();

    return (
        <div className="host-page">
            <h1 className="game-name">Word Frenzy</h1>
            <h1 className="heading">
                {players.length} / {MAX_PLAYERS} | Passcode: ABCD
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
    );
}

export default Host;
