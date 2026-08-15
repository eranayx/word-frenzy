import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import PageNotFound from "./pages/PageNotFound";
import Play from "./pages/Play";
import Winner from "./pages/Winner";
import { GameProvider } from "./contexts/GameContext";

import "./css/App.css";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/lobby/:roomId", element: <Lobby /> },
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
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
