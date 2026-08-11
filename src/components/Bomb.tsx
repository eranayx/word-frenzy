import { generateRandomString } from "../services/api";
import "../css/Bomb.css";
import { useEffect, useState } from "react";

type BombProps = {
    time: number;
};

function Bomb({ time }: BombProps) {
    const formattedTime = `0:${time >= 10 ? time : `0${time}`}`;
    const [subsring, setSubstring] = useState<string>("");
    useEffect(() => {
        const generateRandomString = async () => {
            const str = await generateRandomString()
        };
        // const word = data[0];

        // const numLetters = 2;
        // const randomStart = Math.floor(Math.random() * (word.length - numLetters));

        // return word.slice(randomStart, randomStart + numLetters);
        setSubstring("");
    }, []);

    return (
        <>
            <div className="bomb">
                <div className="bomb-figure">
                    <p>{}</p>
                </div>
                <div className="bomb-timer">{formattedTime}</div>
            </div>
        </>
    );
}

export default Bomb;
