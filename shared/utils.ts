const CODE_LENGTH = 5;

export function generateRoomCode(): string {
    let roomCode = "";

    const A = 65;
    const Z = 90;

    for (let i = 0; i < CODE_LENGTH; i++) {
        roomCode += String.fromCharCode(A + Math.random() * (Z - A));
    }

    return roomCode;
}

let suffix = 0;
export function generateKeySuffix(): string {
    suffix++;
    return String(suffix)
}

// export function generateRandomColor(): string {
//     let color = ""

//     return colorF
// }
