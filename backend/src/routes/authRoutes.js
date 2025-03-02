import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await prisma.user.create({ data: { username } });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

export default router;
