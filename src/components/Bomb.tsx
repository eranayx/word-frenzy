import { useGameContext } from "../contexts/GameContext";
import "../css/Bomb.css";

function Bomb() {
    const { time, substring } = useGameContext();
    const formattedTime = `0:${time >= 10 ? time : `0${time}`}`;

    return (
        <>
            <div className="bomb">
                <div className="bomb-model">
                    <p>{substring}</p>
                </div>
                <div className="bomb-timer">{formattedTime}</div>
            </div>
        </>
    );
}

export default Bomb;
