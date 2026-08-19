import type { Player } from "../../shared/types";

let players: Player[] = [];

export const addPlayer = (player: Player) => {
    players.push(player);
};

export const removePlayer = (id: string) => {
    players = players.filter((player) => player.id !== id);
};

export const getPlayerFromId = (id: string): Player => {
    const player = players.find((player) => player.id === id);

    if (!player) {
        console.log(id);
        throw new Error(`Attempted to search for invalid player id: ${id}`);
    }

    return player;
};
