const RANDOM_WORD_BASE_URL = "https://random-word-api.herokuapp.com";

export const getRandomSubstring = async (
    numLetters: number,
): Promise<string> => {
    const response: string[] = await getRandomString();
    const word = response[0];
    const randomStart = Math.floor(Math.random() * (word.length - numLetters));

    return word.slice(randomStart, randomStart + numLetters);
};

const getRandomString = async (): Promise<string[]> => {
    const response = await fetch(`${RANDOM_WORD_BASE_URL}/word?diff=1`);
    return response.json();
};
