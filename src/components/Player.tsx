import { useEffect, useState } from "react";

import { Heart, User } from "@boxicons/react";

import { isValidWord } from "../services/api";
import { useGameContext } from "../contexts/GameContext";
import "../css/Player.css";

type PlayerProps = {
    name: string;
};

function Player({ name }: PlayerProps) {
    const FRENZY_LIMIT = 30;

    const [word, setWord] = useState<string>("");
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [frenzyPoints, setFrenzyPoints] = useState<number>(0);
    const { time, substring, resetTime, changeSubstring } = useGameContext();

    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                if (word.length < 0) return;
                if (!word.includes(substring)) return;
                if (!(await isValidWord(word))) return;

                setWord("");
                setTotalPoints((prev) => prev + time);
                setFrenzyPoints((prev) => {
                    if (prev === FRENZY_LIMIT) {
                        return time;
                    }

                    return Math.min(prev + time, FRENZY_LIMIT);
                });
                resetTime();
                changeSubstring();
            }

            if (e.key === "Backspace") {
                setWord((prev) => prev.slice(0, -1));
            }

            const IS_ALPHA: RegExp = /^[A-za-z]$/;
            if (IS_ALPHA.test(e.key)) {
                setWord((prev) => prev + e.key.toLowerCase());
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [time]);

    return (
        <div className="player">
            <div className="hearts">
                <Heart pack="filled" />
                <Heart pack="filled" />
            </div>
            <User />
            <p className="name">{name}</p>
            <p className="word">{word}</p>
            <div className="frenzy-bar-container">
                <div
                    className="frenzy-bar"
                    style={{
                        width: `${(frenzyPoints / FRENZY_LIMIT) * 100}%`,
                        transition: "all 0.75s ease-out",
                    }}></div>
            </div>
            <p className="points">{totalPoints} pts</p>
        </div>
    );
}

export default Player;
