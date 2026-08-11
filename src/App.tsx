import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import Play from "./pages/Play";
import Winner from "./pages/Winner";
import { PlayerProvider } from "./contexts/PlayerContext";

import "./css/App.css";

function App() {
    return (
        <PlayerProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/host" element={<Host />} />
                <Route path="/winner" element={<Winner />} />
            </Routes>
        </PlayerProvider>
    );
}

export default App;
