export interface PlayerData {
    id: string;
    name: string;
    role: "host" | "player";
    word: string;
    totalPoints: number;
    frenzyPoints: number;
    currentRoomCode: string | null;
}

export interface Message {
    message: string;
    sender: PlayerData;
}
