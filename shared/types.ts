export interface Player {
    readonly name: string;
    readonly id: string;
}

// export class Player {
//     public readonly name: string;
//     public readonly id: string;
//     public current_room: string | null = null;

//     constructor(name: string, id: string, current_room?: string) {
//         this.name = name
//         this.id = id
//         this.current_room = current_room ?? null
//     }
// }

export interface Room {
    players: Player[];
    state: "lobby" | "in game";
}

export interface Message {
    message: string;
    sender: Player;
}
