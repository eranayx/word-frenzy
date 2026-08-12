const RANDOM_WORD_BASE_URL = "https://random-word-api.herokuapp.com";
const DICTIONARY_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export const generateRandomString = async () => {
    const response = await fetch(`${RANDOM_WORD_BASE_URL}/word?diff=1`);
    const data: string[] = await response.json();

    return data;
};

export const isValidWord = async (word: string) => {
    const response = await fetch(`${DICTIONARY_BASE_URL}/${word}`);

    return response.ok
};
