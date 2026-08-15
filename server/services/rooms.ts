import type { Player, Room } from "../../shared/interfaces";

const rooms = new Map<string, Room>();

export const getPlayers = (roomId: string): Player[] => {
    const room = rooms.get(roomId);
    if (room === undefined) {
        throw new Error("Invalid room ID.");
    }

    return room.players;
};

export const addPlayer = (player: Player, roomId: string): void => {
    const room = rooms.get(roomId) ?? { players: [] };
    room.players.push(player);
    rooms.set(roomId, room);
    console.log(`added player ${player.name}`);
    console.log(`room id: ${roomId}`);
    console.log(
        `entry in rooms: ${rooms.get(roomId)?.players.map((player) => player.name)}`,
    );
};

export const getJoinableRoomCode = (): string | null => {
    const joinableRoomCodes = [...rooms.keys()];

    return joinableRoomCodes.length === 0
        ? joinableRoomCodes[
              Math.floor(Math.random() * joinableRoomCodes.length)
          ]
        : null;
};
