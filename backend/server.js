// import express from "express";
// import {PrismaClient } from "@prisma/client";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const prisma = new PrismaClient();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: { origin: "*" },
// //   cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], transports: ["websocket", "polling"], },
// });

// // const io = new Server(server, { path: "/ws" });

// app.use(cors());
// app.use(express.json());

// // 📌 Register a user
// app.post("/register", async (req, res) => {
//   const { username } = req.body;
//   try {
//     const user = await prisma.user.create({
//       data: { username },
//     });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ error: "Username already exists" });
//   }
// });

// // 📌 Get a random destination
// // app.get("/destination", async (req, res) => {
// //   const destination = await prisma.destination.findFirst({
// //     orderBy: { id: "desc" },
// //   });
// //   res.json(destination);
// // });

// // app.get("/api/random-destination", async (req, res) => {
// //     const destination = await prisma.destination.findFirst();
// //     res.json({
// //       destinationId: destination.id,
// //       clue: destination.clues[0],
// //       options: ["Paris", "London", "New York", "Tokyo"], // Replace with real options
// //     });
// //   });

// app.get("/api/random-destination", async (req, res) => {
//     try {
//       // Fetch all destinations from the database
//       const destinations = await prisma.destination.findMany();
  
//       if (destinations.length < 4) {
//         return res.status(400).json({ error: "Not enough destinations to generate unique options!" });
//       }
  
//       // Pick a random destination as the correct answer
//       const randomIndex = Math.floor(Math.random() * destinations.length);
//       const selectedDestination = destinations[randomIndex];
  
//       // Get other destinations (excluding the correct answer)
//       const otherDestinations = destinations.filter((_, index) => index !== randomIndex);
  
//       // Select exactly 3 incorrect options
//       const incorrectOptions = otherDestinations
//         .sort(() => 0.5 - Math.random()) // Shuffle the remaining destinations
//         .slice(0, 3) // Pick 3 incorrect answers
//         .map((d) => d.city); // Extract city names
  
//       // Combine the correct answer with incorrect ones
//       const options = [...incorrectOptions, selectedDestination.city];
  
//       // Shuffle the final options array to randomize order
//       const shuffledOptions = options.sort(() => 0.5 - Math.random());
  
//       // Send response
//       res.json({
//         destinationId: selectedDestination.id,
//         clue: selectedDestination.clues[0], // First clue from array
//         options: shuffledOptions, // 4 unique city options (randomized)
//       });
//     } catch (error) {
//       console.error("Error fetching destination:", error);
//       res.status(500).json({ error: "Failed to fetch destination" });
//     }
//   });
  
  


// // 📌 Submit an answer
// // Register user
// // app.post("/register", async (req, res) => {
// //     const { username } = req.body;
// //     try {
// //       const user = await prisma.user.create({ data: { username } });
// //       res.json(user);
// //     } catch (error) {
// //       res.status(400).json({ error: "Username already exists!" });
// //     }
// //   });
  
//   // Get random destination question
// //   app.get("/random-destination", async (req, res) => {
// //     const destination = await prisma.destination.findFirst();
// //     res.json({
// //       destinationId: destination.id,
// //       clue: destination.clues[0],
// //       options: ["Paris", "London", "New York", "Tokyo"], // Replace with real options
// //     });
// //   });
  
//   // Check answer
//   app.post("/api/game", async (req, res) => {
//     const { userId, destinationId, answer } = req.body;
//     // console.log(userId, destinationId, answer);
//     const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
// //   console.log(destination);
//     if (!destination) return res.status(404).json({ error: "Destination not found!" });
  
//     const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();
//     await prisma.game.create({ data: { userId, destinationId, correct: isCorrect } });
  
//     res.json({ correct: isCorrect });
//   });
  

// // 📌 Get user score
// // app.get("/api/score/:userId", async (req, res) => {
// //   const userId = req.params.userId;
// //   const score = await prisma.game.count({
// //     where: { userId, correct: true },
// //   });
// //   res.json({ score });
// // });

// // 🟢 REST API: Save player score
// app.post("/api/score", async (req, res) => {
//     try {
//         const { username, score } = req.body;
//         console.log(username, score);

//         // Find the user in the database
//         const existingUser = await prisma.user.findUnique({
//             where: { username },
//         });

//         if (existingUser) {
//             // Update the user's score
//             await prisma.user.update({
//                 where: { username },
//                 data: { score: existingUser.score + score }, // Increment score
//             });

//             res.json({ message: "Score updated!" });
//         } else {
//             // Create new user if they don't exist
//             await prisma.user.create({ data: { username, score } });
//             res.json({ message: "New user created and score saved!" });
//         }
//     } catch (error) {
//         console.error("Error saving score:", error);
//         res.status(500).json({ error: "Failed to save score" });
//     }
// });

// // WebSocket: Real-time game logic

// io.on("connection", (socket) => {
//     console.log("Player connected:", socket.id);
//     // console.log(socket);
//     socket.on("joinGame", ({ roomId, username }) => {
//         console.log(roomId);
//       socket.join(roomId);
//       io.to(roomId).emit("playerJoined", { username });
//     });
  
//     socket.on("submitAnswer", ({ roomId, username, answer }) => {
//       io.to(roomId).emit("answerReceived", { username, answer });
//     });
  
// // Handle chat messages
// socket.on("chatMessage", ({ roomId, username, message }) => {
//   console.log(`Message in ${roomId} from ${username}: ${message}`);
//   io.to(roomId).emit("chatMessage", { username, message }); // Broadcast message
// });


//     socket.on("disconnect", () => {
//       console.log("Player disconnected:", socket.id);
//     });
//   });
  

// // Start the server
// const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./src/app.js";
import setupGameSocket from "./src/websocket/gameSocket.js";

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

setupGameSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
