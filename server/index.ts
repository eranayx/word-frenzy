import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

import type { Message, Player } from "../shared/types";
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
import { FRENZY_LIMIT } from "../shared/constants";

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

    socket.on("add_player", (player: Player, roomCode: string): void => {
        addPlayer(player, roomCode);
        socket.join(roomCode);
        io.to(roomCode).emit("player_joined", getPlayers(roomCode));
    });

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

        if (!player.current_room) {
            throw new Error(
                "update_word event called when player is not in a room.",
            );
        }

        player.word = word;
        io.to(player.current_room).emit(
            "word_updated",
            getPlayers(player.current_room),
        );
    });

    socket.on(
        "entered_word",
        (roomCode: string, playerId: string, time: number): void => {
            const player = getPlayerFromId(playerId);
            if (!player.current_room) {
                throw new Error(
                    "update_word event called when player is not in a room.",
                );
            }

            player.word = "";
            player.totalPoints += time;
            player.frenzyPoints =
                player.frenzyPoints === FRENZY_LIMIT
                    ? time
                    : Math.min(player.frenzyPoints + time, FRENZY_LIMIT);

            refreshTimer(roomCode);
            refreshSubstring(roomCode, io);
            io.to(player.current_room).emit(
                "word_updated",
                getPlayers(player.current_room),
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
