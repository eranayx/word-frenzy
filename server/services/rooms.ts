import type { Player, Room } from "../../shared/types";
import { addPlayer as addPlayerGlobal } from "./playerServices";

const rooms = new Map<string, Room>();

export const getPlayers = (roomCode: string): Player[] => {
    const room = rooms.get(roomCode);
    if (room === undefined) {
        throw new Error("Invalid room ID.");
    }

    return room.players;
};

export const addPlayer = (player: Player, roomCode: string): void => {
    const room = rooms.get(roomCode) ?? { players: [], state: "lobby" };
    room.players.push(player);
    rooms.set(roomCode, room);
    addPlayerGlobal(player);
};

export const isValidRoomCode = (code: string): boolean => {
    return rooms.get(code) !== undefined;
};

export const getJoinableRoomCode = (): string | null => {
    const joinableRoomCodes = [...rooms.keys()];

    return joinableRoomCodes.length === 0
        ? joinableRoomCodes[
              Math.floor(Math.random() * joinableRoomCodes.length)
          ]
        : null;
};
