import { addPlayer as addPlayerGlobal } from "../services/playerService";
import { DEFAULT_SUBSTRING_LENGTH } from "../../shared/constants";
import type { Server } from "socket.io";
import { getRandomSubstring } from "./randomWordService";
import type Player from "../classes/Player";
import Room from "../classes/Room";

const rooms = new Map<string, Room>();

export const getRoom = (roomCode: string): Room => {
    const room = rooms.get(roomCode);

    if (!room) {
        throw new Error(`Invalid room code: ${roomCode}`);
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
