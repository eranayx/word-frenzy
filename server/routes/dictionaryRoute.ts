import express from "express";

import { isRealWord } from "../services/dictionaryService";

const router = express.Router();

router.get("/define/:word", async (req, res) => {
    try {
        const word = req.params.word;
        const isReal = await isRealWord(word);

        return res.json({ isReal });
    } catch (err) {
        console.log(`Internal server error: ${err}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
