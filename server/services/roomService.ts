import type { Server } from "socket.io";

import Room from "../classes/Room";
import Player from "../classes/Player";
import { getRandomSubstring } from "./randomWordService";
import {
    addPlayer as addPlayerGlobal,
    getPlayerFromId,
} from "../services/playerService";
import { DEFAULT_SUBSTRING_LENGTH } from "../../shared/constants";

const rooms = new Map<string, Room>();

export const getRoom = (roomCode: string): Room => {
    const room = rooms.get(roomCode);

    if (!room) {
        throw new Error("Invalid room code");
    }

    return room;
};

export const addPlayer = (player: Player, roomCode: string): void => {
    const room = rooms.get(roomCode) ?? new Room([]);
    room.addPlayer(player);

    rooms.set(roomCode, room);
    addPlayerGlobal(player);
};

export const isValidRoomCode = (roomCode: string): boolean => {
    return rooms.get(roomCode) !== undefined;
};

export const getJoinableRoomCode = (): string | null => {
    const joinableRoomCodes = [...rooms.keys()];

    return joinableRoomCodes.length === 0
        ? joinableRoomCodes[
              Math.floor(Math.random() * joinableRoomCodes.length)
          ]
        : null;
};

export const startTimer = (roomCode: string, io: Server): void => {
    const room = getRoom(roomCode);
    if (room.timerTimeout) return;

    async function tick() {
        const hitZero = room.advanceTimer();
        if (hitZero) {
            await refreshSubstring(roomCode, io);

            const typer = getPlayerFromId(room.typersId);
            typer.health--;
            io.to(roomCode).emit("recieve_players", room.getPlayers());

            if (typer.health === 0) {
                room.playersAlive--;
            }

            if (room.playersAlive <= 1) {
                room.stopTimer();
                io.to(roomCode).emit("game_over");
                return;
            }

            room.determineNextTyper();
            io.to(roomCode).emit("recieve_players", room.getPlayers());
            io.to(roomCode).emit("typer_updated", room.typersId);
        }

        io.to(roomCode).emit(
            "update_time",
            room.timer,
            room.getFormattedTime(),
        );
        room.timerTimeout = setTimeout(tick, 1000);
    }

    tick();
};

export const refreshSubstring = async (
    roomCode: string,
    io: Server,
): Promise<void> => {
    const room = getRoom(roomCode);

    const substring = await getRandomSubstring(
        room.substringLength ?? DEFAULT_SUBSTRING_LENGTH,
    );
    io.to(roomCode).emit("recieved_substring", substring);
};
