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
    getRoom,
    isValidRoomCode,
    refreshSubstring,
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
        const room = getRoom(roomCode);
        io.to(roomCode).emit("recieve_players", room.getPlayers());
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

            const room = getRoom(roomCode);
            io.to(roomCode).emit("player_joined", room.getPlayers());
        },
    );

    socket.on(
        "check_valid_code",
        (roomCode: string, callback: (isValid: boolean) => void): void => {
            const isValid =
                isValidRoomCode(roomCode) && !getRoom(roomCode).isRoomFull();
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

    socket.on("start_game", (roomCode: string): void => {
        const room = getRoom(roomCode);
        room.determineNextTyper();

        io.to(roomCode).emit("start_game");
        startTimer(roomCode, io);
    });

    socket.on("get_current_typer", (roomCode: string): void => {
        const room = getRoom(roomCode);
        io.to(roomCode).emit("typer_updated", room.typersId);
    });

    socket.on("update_word", (playerId: string, word: string): void => {
        const player = getPlayerFromId(playerId);

        if (!player.currentRoomCode) {
            throw new Error(
                "update_word event called when player is not in a room.",
            );
        }

        player.word = word;

        const room = getRoom(player.currentRoomCode);
        io.to(player.currentRoomCode).emit("word_updated", room.getPlayers());
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

            const room = getRoom(player.currentRoomCode);
            room.determineNextTyper();
            io.to(player.currentRoomCode).emit("typer_updated", room.typersId);

            player.addPoints(time);

            await refreshSubstring(player.currentRoomCode, io);

            room.refreshTimer();
            io.to(player.currentRoomCode).emit(
                "word_updated",
                room.getPlayers(),
            );
        },
    );

    socket.on("get_winner", (roomCode: string): void => {
        const room = getRoom(roomCode);
        io.to(roomCode).emit(
            "recieved_winner",
            room.players.find((player) => player.health > 0),
        );
    });
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
