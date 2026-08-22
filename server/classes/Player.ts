import { FRENZY_LIMIT } from "../../shared/constants";
import type { PlayerData } from "../../shared/interfaces";

class Player implements PlayerData {
    // Defines a player class.
    public readonly name: string;
    public readonly id: string;

    public role: "host" | "player";
    public currentRoomCode: string;
    public word = "";

    private _totalPoints = 0;
    private _frenzyPoints = 0;

    constructor(
        name: string,
        id: string,
        role: "host" | "player",
        currentRoomCode: string,
    ) {
        this.name = name;
        this.id = id;
        this.role = role;
        this.currentRoomCode = currentRoomCode ?? null;
    }

    public get totalPoints(): number {
        return this._totalPoints;
    }

    private set totalPoints(v: number) {
        if (v < 0) throw new Error("Total points must be nonnegative.");
        this._totalPoints = v;
    }

    public get frenzyPoints(): number {
        return this._frenzyPoints;
    }

    private set frenzyPoints(v: number) {
        if (v < 0) throw new Error("Total points must be nonnegative.");

        if (this.frenzyPoints === FRENZY_LIMIT) {
            this._frenzyPoints = v - FRENZY_LIMIT;
        } else if (v <= FRENZY_LIMIT) {
            this._frenzyPoints = v;
        } else if (v > FRENZY_LIMIT) {
            this._frenzyPoints = FRENZY_LIMIT;
        }
    }

    // Instance methods
    public addPoints(v: number): void {
        this.totalPoints += v;
        this.frenzyPoints += v;
    }

    public resetWord(): void {
        this.word = "";
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            word: this.word,
            totalPoints: this.totalPoints,
            frenzyPoints: this.frenzyPoints,
            currentRoomCode: this.currentRoomCode,
        };
    }
}

export default Player;
