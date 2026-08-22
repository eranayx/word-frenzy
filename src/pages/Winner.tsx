import { useParams } from "react-router-dom";

import { useSocketContext } from "../contexts/SocketContext";
import { useEffect, useState } from "react";
import type { PlayerData as Player } from "../../shared/interfaces";

function Winner() {
    const { socket, isConnected } = useSocketContext();
    const { roomCode } = useParams();
    const [winner, setWinner] = useState<Player>();

    useEffect(() => {
        if (!socket) return;

        function updateWinner(v: Player): void {
            setWinner(v);
        }

        socket.on("recieved_winner", updateWinner);
        socket.emit("get_winner", roomCode);

        return () => {
            socket.off("recieved_winner", updateWinner);
        };
    });

    if (!socket || !isConnected) return;

    return <div className="winner-page">Congrats to {winner?.name}</div>;
}

export default Winner;
