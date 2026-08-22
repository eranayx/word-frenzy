import Player from "./Player";
import {
    DEFAULT_SUBSTRING_LENGTH,
    MAX_LOBBY_SIZE,
    TIME_LIMIT,
} from "../../shared/constants";

class Room {
    // Declares the Room class.

    // Instance attributes
    public players: Player[];
    public state: "lobby" | "in game" = "lobby";
    public timerTimeout?: NodeJS.Timeout;

    private _timer: number = 1;
    private _substringLength: number = DEFAULT_SUBSTRING_LENGTH;
    private _typersId: string | null = null;
    private _typersIdx: number | null = null;
    private _playersAlive: number = 0;

    // Constructor(s)
    constructor(players: Player[]) {
        this.players = players;
    }

    // Getters/setters
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

    public get typersId(): string {
        if (this._typersId === null) {
            throw new Error("The room is empty; it's no one's turn.");
        }

        return this._typersId;
    }

    private set typersId(v: string) {
        this._typersId = v;
    }

    public get playersAlive(): number {
        return this._playersAlive;
    }

    public set playersAlive(v: number) {
        if (v < 0) throw new Error("Timer must be nonnegative.");
        this._playersAlive = v;
    }

    // Class methods
    public getPlayers = (): Player[] => {
        return this.players;
    };

    public addPlayer = (player: Player): void => {
        this.players.push(player);
        this.playersAlive++;
    };

    public isRoomFull = (): boolean => {
        return this.players.length === MAX_LOBBY_SIZE;
    };

    public determineNextTyper = (): void => {
        this._typersIdx =
            this._typersIdx === null
                ? Math.floor(Math.random() * this.players.length)
                : (this._typersIdx + 1) % this.players.length;
        this.typersId = this.players[this._typersIdx].id;
        this.resetTypersWord();
    };

    public advanceTimer = (): boolean => {
        /**
         * Advances the timer by 1 second.
         *
         * @returns true if the timer hits 0 else false.
         */
        this.timer = this.timer > 0 ? this.timer - 1 : TIME_LIMIT;
        return this.timer === 0;
    };

    public stopTimer = (): void => {
        if (this.timerTimeout) {
            clearTimeout(this.timerTimeout);
            this.timerTimeout = undefined;
        }
    };

    public refreshTimer = (): void => {
        this.timer = TIME_LIMIT;
    };

    public getFormattedTime(): string {
        return `0:${this.timer >= 10 ? this.timer : `0${this.timer}`}`;
    }

    private resetTypersWord = () => {
        if (this._typersIdx === null) return;
        this.players[this._typersIdx].resetWord();
    };
}

export default Room;
