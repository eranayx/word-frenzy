const BASE_URL = "https://random-word-api.herokuapp.com";

export const generateRandomString = async () => {
    const response = await fetch(`${BASE_URL}/word?diff=1`);
    const data: string[] = await response.json();

    return data;
};
