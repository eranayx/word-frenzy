export interface PlayerData {
    id: string;
    name: string;
    role: "host" | "player";
    word: string;
    health: number;
    totalPoints: number;
    frenzyPoints: number;
    currentRoomCode: string;
}

export interface Message {
    message: string;
    sender: PlayerData;
}
