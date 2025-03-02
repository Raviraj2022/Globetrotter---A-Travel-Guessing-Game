import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

// Submit an answer
router.post("/game", async (req, res) => {
  const { userId, destinationId, answer } = req.body;
  const destination = await prisma.destination.findUnique({ where: { id: destinationId } });

  if (!destination) return res.status(404).json({ error: "Destination not found!" });

  const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();
  await prisma.game.create({ data: { userId, destinationId, correct: isCorrect } });

  res.json({ correct: isCorrect });
});

export default router;
