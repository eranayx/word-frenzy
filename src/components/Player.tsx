import { useEffect } from "react";

import { Heart, User } from "@boxicons/react";

import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { isValidWord } from "../services/api";
import type { PlayerData as Player } from "../../shared/interfaces";
import { FRENZY_LIMIT, IS_ALPHA } from "../../shared/constants";
import "../css/Player.css";

interface PlayerProps {
    player: Player;
    isFocusedOnChat: boolean;
}

function PlayerComponent({ player, isFocusedOnChat }: PlayerProps) {
    const { rawTime, substring, typerId } = useGameContext();
    const { socket, isConnected } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleKeyDown = async (e: KeyboardEvent): Promise<void> => {
            if (!player || player.id !== socket.id || isFocusedOnChat) {
                return;
            }
            if (e.key === "Enter") {
                if (!(await isValidWord(player.word, substring))) return;
                socket.emit("entered_word", player.id, rawTime);
                console.log("total", player.totalPoints)
                console.log("frenzy", player.frenzyPoints)
            }

            if (e.key === "Backspace") {
                socket.emit("update_word", player.id, player.word.slice(0, -1));
            }

            if (IS_ALPHA.test(e.key)) {
                socket.emit(
                    "update_word",
                    player.id,
                    player.word + e.key.toLowerCase(),
                );
            }
        };

        if (player.id !== typerId) {
            document.removeEventListener("keydown", handleKeyDown);
            return;
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [player, typerId, isFocusedOnChat]);

    if (!socket || !isConnected) return;

    return (
        <div className={`player ${player.id === typerId ? "active" : ""}`}>
            <div className="hearts">
                <Heart pack="filled" />
                <Heart pack="filled" />
            </div>
            <User />
            <p className={`name ${player.id === socket.id ? "is-user" : ""}`}>
                {player.name}
            </p>
            <p className="word">{player.word}</p>
            <div className="frenzy-bar-container">
                <div
                    className="frenzy-bar"
                    style={{
                        width: `${(player.frenzyPoints / FRENZY_LIMIT) * 100}%`,
                        transition: "all 0.75s ease-out",
                    }}></div>
            </div>
            <p className="points">{player.totalPoints} pts</p>
        </div>
    );
}

export default PlayerComponent;
