import express, { type Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

import type { Message, Player } from "../shared/types";
import {
    addPlayer,
    getJoinableRoomCode,
    getPlayers,
    isValidRoomCode,
} from "./services/rooms";
import { getPlayerFromId } from "./services/playerServices";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data: Message, roomCode: string): void => {
        // let roomCode = ""
        io.to(roomCode).emit("recieve_message", data);
    });

    socket.on(
        "get_player",
        (socketId: string, callback: (player: Player) => void): void => {
            const player = getPlayerFromId(socketId);
            callback(player);
        },
    );

    socket.on("get_players", (roomCode: string): void => {
        io.to(roomCode).emit("recieve_players", getPlayers(roomCode));
    });

    socket.on("add_player", (player: Player, roomCode: string): void => {
        addPlayer(player, roomCode);
        socket.join(roomCode);
        io.to(roomCode).emit("player_joined", getPlayers(roomCode));
    });

    socket.on(
        "check_valid_code",
        (roomCode: string, callback: (isValid: boolean) => void): void => {
            const isValid = isValidRoomCode(roomCode);
            callback(isValid);
        },
    );

    socket.on(
        "get_joinable_room_code",
        (callback: (roomCode: string | null) => void): void => {
            const joinableRoomCode = getJoinableRoomCode();
            callback(joinableRoomCode);
        },
    );
});

server.listen(process.env.SERVER_PORT || 8080, () => {
    console.log(`server is running at port ${process.env.SERVER_PORT}`);
});
