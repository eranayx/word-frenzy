import Player from "./Player";
import { DEFAULT_SUBSTRING_LENGTH } from "../../shared/constants";

class Room {
    public players: Player[];
    public state: "lobby" | "in game" = "lobby";
    public timerTimeout?: NodeJS.Timeout;

    private _timer: number = 0;
    private _substringLength: number = DEFAULT_SUBSTRING_LENGTH;
    private _typers_index: number | null = null;

    constructor(players: Player[]) {
        this.players = players;
    }

    public get timer(): number {
        return this._timer;
    }

    public set timer(v: number) {
        if (v < 0) throw new Error("Timer must be nonnegative.");
        this._timer = v;
    }

    public get substringLength(): number {
        return this._substringLength;
    }

    public set substringLength(v: number) {
        if (v < 0) throw new Error("Substring length must be nonnegative.");
        this._substringLength = v;
    }

    public get typers_index(): number {
        if (this._typers_index === null) {
            throw new Error("The room is empty; it's no one's turn.");
        }

        return this._typers_index;
    }
}

export default Room;
