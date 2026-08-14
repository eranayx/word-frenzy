import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePlayerContext } from "../contexts/PlayerContext";
import "../css/Home.css";

function Home() {
    const [name, setName] = useState<string>("");
    const { addPlayer } = usePlayerContext();
    const navigate = useNavigate();

    function handlePlay(): void {
        if (!name) return;

        addPlayer({ name: name, id: 1 });
        navigate("/play");
    }
    function handleJoin(): void {
        if (!name) return;

        navigate("/");
    }
    function handleHost(): void {
        if (!name) return;

        addPlayer({ name: name, id: 2 });
        navigate("/host");
    }

    return (
        <>
            <div className="hero">
                <div className="hero-text">
                    <h1 className="hero-title">Word Frenzy</h1>
                    <p className="subtext">A unique twist on an iconic game</p>
                </div>
                <div className="cta">
                    <form className="name-form">
                        <label htmlFor="name">Enter a name: </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </form>
                    <div className="cta-btns">
                        <button className="start-btn" onClick={handlePlay}>
                            Play
                        </button>
                        <button className="start-btn" onClick={handleJoin}>
                            Join
                        </button>
                        <button className="start-btn" onClick={handleHost}>
                            Host
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
