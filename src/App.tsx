import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Host from "./pages/Host";
import PageNotFound from "./pages/PageNotFound";
import Play from "./pages/Play";
import Winner from "./pages/Winner";
import { GameProvider } from "./contexts/GameContext";
import { PlayerProvider } from "./contexts/PlayerContext";

import "./css/App.css";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/host", element: <Host /> },
    {
        path: "/play",
        element: (
            <GameProvider>
                <Play />
            </GameProvider>
        ),
    },
    { path: "/winner", element: <Winner /> },
    { path: "*", element: <PageNotFound /> },
]);

function App() {
    return (
        <PlayerProvider>
            <RouterProvider router={router} />
        </PlayerProvider>
    );
}

export default App;
