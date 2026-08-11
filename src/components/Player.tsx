import { useEffect, useState } from "react";

import { Heart, User } from "@boxicons/react";

import "../css/Player.css";

type PlayerProps = {
    name: string;
    time: number;
    onEnter: () => void;
};

function Player({ name, time, onEnter }: PlayerProps) {
    const [word, setWord] = useState<string>("");
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [frenzyPoints, setFrenzyPoints] = useState<number>(0);

    const FRENZY_LIMIT = 50;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (word.length > 0 && e.key === "Enter") {
                onEnter();
                setWord("");
                setTotalPoints((prev) => prev + time);
                setFrenzyPoints((prev) => {
                    if (prev === FRENZY_LIMIT) {
                        return time;
                    }

                    return Math.min(prev + time, FRENZY_LIMIT);
                });
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
