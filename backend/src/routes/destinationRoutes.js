import express from "express";
import prisma from "../config/prisma.js";

const router = express.Router();

// Get a random destination
router.get("/random-destination", async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany();
    if (destinations.length < 4) {
      return res.status(400).json({ error: "Not enough destinations to generate unique options!" });
    }

    const randomIndex = Math.floor(Math.random() * destinations.length);
    const selectedDestination = destinations[randomIndex];
    const otherDestinations = destinations.filter((_, index) => index !== randomIndex);

    const incorrectOptions = otherDestinations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => d.city);

    const options = [...incorrectOptions, selectedDestination.city].sort(() => 0.5 - Math.random());

    res.json({
      destinationId: selectedDestination.id,
      clue: selectedDestination.clues[0],
      options,
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});

export default router;
