import express from "express";

import { getRandomSubstring } from "../services/randomWordService";

const router = express.Router();

router.get("/randomSubstring", async (req, res) => {
    const numLetters = Number(req.query.numLetters as string);

    try {
        const substring: string = await getRandomSubstring(numLetters);
        return res.json({ substring });
    } catch (err) {
        console.log(`Internal server error: ${err}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
