import { addPlayer as addPlayerGlobal } from "../services/playerService";
import {
    DEFAULT_SUBSTRING_LENGTH,
    MAX_LOBBY_SIZE,
    TIME_LIMIT,
} from "../../shared/constants";
import type { Server } from "socket.io";
import { getRandomSubstring } from "./randomWordService";
import type Player from "../classes/Player";
import Room from "../classes/Room";

const rooms = new Map<string, Room>();

export const getPlayers = (roomCode: string): Player[] => {
    const room = getRoom(roomCode);
    return room.players;
};

export const addPlayer = (player: Player, roomCode: string): void => {
    const room = rooms.get(roomCode) ?? new Room([]);

    room.players.push(player);
    rooms.set(roomCode, room);
    addPlayerGlobal(player);
};

export const isValidRoomCode = (roomCode: string): boolean => {
    return rooms.get(roomCode) !== undefined;
};

export const isRoomFull = (roomCode: string): boolean => {
    const room = rooms.get(roomCode);
    return room !== undefined ? room.players.length >= MAX_LOBBY_SIZE : true;
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
    room.timer = 0;

    async function tick() {
        if (room.timer === 0) {
            await refreshSubstring(roomCode, io);
        }

        room.timer = room.timer > 0 ? room.timer - 1 : TIME_LIMIT;

        const formattedTime = `0:${room.timer >= 10 ? room.timer : `0${room.timer}`}`;
        io.to(roomCode).emit("update_time", room.timer, formattedTime);

        room.timerTimeout = setTimeout(tick, 1000);
    }

    tick();
};

export const endTimer = (roomCode: string): void => {
    const room = getRoom(roomCode);
    clearInterval(room.timerTimeout);
};

export const getRoom = (roomCode: string): Room => {
    const room = rooms.get(roomCode);

    if (!room) {
        throw new Error(`Invalid room code: ${roomCode}`);
    }

    return room;
};

export const refreshTimer = (roomCode: string): void => {
    const room = getRoom(roomCode);
    room.timer = TIME_LIMIT;
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
