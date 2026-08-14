import { useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";
import { Send } from "@boxicons/react";

import "../css/Chat.css";

function Chat() {
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const socketRef = useRef<Socket | null>(null);

    // Pull the socket up to use as context?

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL);
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (socket === null) return;

        const handleMessage = (data: { message: string }) => {
            setMessageHistory((prev) => [...prev, data.message]);
        };
        socket.on("recieve_message", handleMessage);

        return () => {
            socket.off("recieve_message", handleMessage);
        };
    }, []);

    const sendMessage = (e: React.MouseEvent) => {
        const socket = socketRef.current;
        if (socket === null) return;

        socket.emit("send_message", { message });

        e.preventDefault();
        setMessage("");
    };

    return (
        <div className="chat">
            <div className="message-history">
                {messageHistory.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>
            <form>
                <input
                    id="textbox"
                    type="text"
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={(e) => {
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
