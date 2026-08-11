import { useEffect, useState } from "react";

import Bomb from "../components/Bomb";
import Chat from "../components/Chat";
import Player from "../components/Player";

import { usePlayerContext } from "../contexts/PlayerContext";
import "../css/Play.css";

function Play() {
    const TIME_LIMIT = 15;
    const [timer, setTimer] = useState<number>(TIME_LIMIT);
    const { players } = usePlayerContext();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : TIME_LIMIT));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="play-page">
            <div className="game">
                <div className="players">
                    {players.map((player) => (
                        <Player
                            name={player.name}
                            time={timer}
                            onEnter={() => setTimer(TIME_LIMIT)}
                        />
                    ))}
                </div>
                <Bomb time={timer} />
            </div>
            <Chat />
        </div>
    );
}

export default Play;
