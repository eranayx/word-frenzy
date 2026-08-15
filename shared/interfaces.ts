export interface Player {
    name: string;
    readonly id: string;
}

export interface Room {
    players: Player[];
}
