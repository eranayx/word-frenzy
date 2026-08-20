export const isValidWord = async (
    word: string,
    substring: string,
): Promise<boolean> => {
    if (!word.length || !word.includes(substring)) return false;

    const { isReal } = await isRealWord(word);
    return isReal;
};

export const getRandomSubstring = async (
    numLetters: number,
): Promise<{ substring: string }> => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/randomSubstring?numLetters=${numLetters}`,
    );
    return response.json();
};

const isRealWord = async (word: string): Promise<{ isReal: boolean }> => {
    const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/isReal/${word}`,
    );
    return response.json();
};
