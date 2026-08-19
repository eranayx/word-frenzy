import { useGameContext } from "../contexts/GameContext";
import "../css/Bomb.css";

function Bomb() {
    const { formattedTime, substring } = useGameContext();

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
