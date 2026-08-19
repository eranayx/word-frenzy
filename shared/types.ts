export class Player {
    // Defines a player class.
    public readonly name: string;
    public readonly id: string;
    public role: "host" | "player";

    public current_room: string | null = null;
    public word = "";
    public totalPoints = 0;
    public frenzyPoints = 0;

    constructor(
        name: string,
        id: string,
        role: "host" | "player",
        current_room?: string,
    ) {
        this.name = name;
        this.id = id;
        this.role = role;
        this.current_room = current_room ?? null;
    }
}

export interface Room {
    players: Player[];
    state: "lobby" | "in game";
    timer: number;
    substring_length?: number;
    timerTimeout?: NodeJS.Timeout;
}

export interface Message {
    message: string;
    sender: Player;
}
