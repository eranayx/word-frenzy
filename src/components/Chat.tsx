import { useEffect, useState } from "react";

import { Send, User } from "@boxicons/react";

import type { Message, Player } from "../../shared/types";
import { useSocketContext } from "../contexts/SocketContext";
import "../css/Chat.css";

interface ChatProps {
    roomCode: string;
}

function Chat({ roomCode }: ChatProps) {
    const [message, setMessage] = useState<string>("");
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [player, setPlayer] = useState<Player>();
    const socket = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: Message) => {
            setMessageHistory((prev) => [...prev, message]);
        };
        socket.on("recieve_message", handleMessage);

        const getPlayer = async (): Promise<void> => {
            const player: Player = await socket.emitWithAck(
                "get_player",
                socket.id,
            );

            setPlayer(player);
        };
        getPlayer();

        return () => {
            socket.off("recieve_message", handleMessage);
        };
    }, []);

    const sendMessage = (e: React.MouseEvent) => {
        if (!socket) return;

        socket.emit("send_message", { message: message, sender: player }, roomCode);

        e.preventDefault();
        setMessage("");
    };

    return (
        <div className="chat">
            <div className="message-history">
                {messageHistory.map((msg) => (
                    <div className="message" key={msg.sender.id}>
                        <User size="xs" />
                        <p>
                            {msg.sender.name}: {msg.message}
                        </p>
                    </div>
                ))}
            </div>
            <form>
                <input
                    id="textbox"
                    type="text"
                    placeholder="What's on your mind?"
                    value={message}
                    autoComplete="off"
                    onChange={(e) => {
                        if (!socket || !socket.id) {
                            throw new Error(
                                "Socket refused to connect. Cannot send chat message.",
                            );
                        }
                        setMessage(e.target.value);
                    }}
                />
                <button type="submit" onClick={sendMessage}>
                    <Send pack="filled" fill="#8da6e1" size="sm" />
                </button>
            </form>
        </div>
    );
}

export default Chat;
