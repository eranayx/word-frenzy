import { useEffect, useState } from "react";

import { Send, User } from "@boxicons/react";

import type { Message } from "../../shared/interfaces";
import type { PlayerData as Player } from "../../shared/interfaces";
import { useSocketContext } from "../contexts/SocketContext";
import "../css/Chat.css";

interface ChatProps {
    roomCode: string;
    setIsFocused?: (value: boolean) => void;
}

function Chat({ roomCode, setIsFocused }: ChatProps) {
    const [message, setMessage] = useState<string>("");
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [player, setPlayer] = useState<Player>();
    const { socket, isConnected } = useSocketContext();

    useEffect(() => {
        if (!socket) return;

        const getPlayer = async (): Promise<void> => {
            const player: Player = await socket.emitWithAck(
                "get_current_player",
                socket.id,
            );

            setPlayer(player);
        };

        getPlayer();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: Message) => {
            setMessageHistory((prev) => [...prev, message]);
        };
        socket.on("recieve_message", handleMessage);

        return () => {
            socket.off("recieve_message", handleMessage);
        };
    }, []);

    const sendMessage = (e: React.MouseEvent) => {
        if (!socket) return;

        socket.emit(
            "send_message",
            { message: message, sender: player },
            roomCode,
        );

        e.preventDefault();
        setMessage("");
    };

    if (!socket || !isConnected) return;

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
                        if (!socket.id) {
                            throw new Error(
                                "Socket refused to connect. Cannot send chat message.",
                            );
                        }
                        setMessage(e.target.value);
                    }}
                    onFocus={() => {
                        if (setIsFocused) {
                            setIsFocused(true);
                        }
                    }}
                    onBlur={() => {
                        if (setIsFocused) {
                            setIsFocused(false);
                        }
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
