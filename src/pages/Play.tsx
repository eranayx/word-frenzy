import Bomb from "../components/Bomb";
import Chat from "../components/Chat";
import Player from "../components/Player";

import { usePlayerContext } from "../contexts/PlayerContext";

import "../css/Play.css";

function Play() {
    const { players } = usePlayerContext();

    return (
        <div className="play-page">
            <div className="game">
                <div className="players">
                    {players.map((player, i) => (
                        <Player name={player.name} key={i} />
                    ))}
                </div>
                <Bomb />
            </div>
            <Chat />
        </div>
    );
}

export default Play;
