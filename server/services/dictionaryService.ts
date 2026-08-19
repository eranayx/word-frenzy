const DICTIONARY_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export const isRealWord = async (word: string): Promise<boolean> => {
    const response = await fetch(`${DICTIONARY_BASE_URL}/${word}`);
    return response.ok;
};
