import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

import type { Message } from "../shared/interfaces";
import Player from "./classes/Player";
import {
    addPlayer,
    getJoinableRoomCode,
    getPlayers,
    isRoomFull,
    isValidRoomCode,
    refreshSubstring,
    refreshTimer,
    startTimer,
} from "./services/roomService";
import { getPlayerFromId } from "./services/playerService";
import dictionaryRoute from "./routes/dictionaryRoute";
import randomWordRoute from "./routes/randomWordRoute";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

app.use(cors({ origin: "http://localhost:5173" }));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data: Message, roomCode: string): void => {
        io.to(roomCode).emit("recieve_message", data);
    });

    socket.on(
        "get_current_player",
        (socketId: string, callback: (player: Player) => void): void => {
            const player = getPlayerFromId(socketId);
            callback(player);
        },
    );

    socket.on("get_players", (roomCode: string): void => {
        io.to(roomCode).emit("recieve_players", getPlayers(roomCode));
    });

    socket.on(
        "add_player",
        (
            player: { name: string; playerId: string; role: "host" | "player" },
            roomCode: string,
        ): void => {
            addPlayer(
                new Player(player.name, player.playerId, player.role, roomCode),
                roomCode,
            );
            socket.join(roomCode);
            io.to(roomCode).emit("player_joined", getPlayers(roomCode));
        },
    );

    socket.on(
        "check_valid_code",
        (roomCode: string, callback: (isValid: boolean) => void): void => {
            const isValid = isValidRoomCode(roomCode) && !isRoomFull(roomCode);
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

    socket.on("start_game", async (roomCode: string): Promise<void> => {
        io.to(roomCode).emit("start_game");
        startTimer(roomCode, io);
    });

    socket.on("update_word", (playerId: string, word: string): void => {
        const player = getPlayerFromId(playerId);

        if (!player.currentRoomCode) {
            throw new Error(
                "update_word event called when player is not in a room.",
            );
        }

        player.word = word;
        io.to(player.currentRoomCode).emit(
            "word_updated",
            getPlayers(player.currentRoomCode),
        );
    });

    socket.on(
        "entered_word",
        async (playerId: string, time: number): Promise<void> => {
            const player = getPlayerFromId(playerId);
            if (!player.currentRoomCode) {
                throw new Error(
                    "update_word event called when player is not in a room.",
                );
            }

            player.word = "";
            player.addPoints(time);
            console.log(player.totalPoints);

            await refreshSubstring(player.currentRoomCode, io);
            refreshTimer(player.currentRoomCode);
            io.to(player.currentRoomCode).emit(
                "word_updated",
                getPlayers(player.currentRoomCode),
            );
        },
    );
});

server.listen(process.env.SERVER_PORT || 8080, () => {
    console.log(
        `(socket.io) server is running at port ${process.env.SERVER_PORT}`,
    );
});

app.listen(process.env.SERVER_PORT || 8080, () => {
    console.log(
        `(express) server is running at port ${process.env.SERVER_PORT}`,
    );
});

app.use("/api", dictionaryRoute, randomWordRoute);
