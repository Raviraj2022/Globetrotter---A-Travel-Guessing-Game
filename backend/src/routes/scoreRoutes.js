import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

// Save player score
router.post("/score", async (req, res) => {
  try {
    const { username, score } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      await prisma.user.update({
        where: { username },
        data: { score: existingUser.score + score },
      });
      res.json({ message: "Score updated!" });
    } else {
      await prisma.user.create({ data: { username, score } });
      res.json({ message: "New user created and score saved!" });
    }
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

export const scoreRoutes = router;
