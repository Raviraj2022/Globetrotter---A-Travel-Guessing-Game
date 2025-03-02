import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import {scoreRoutes} from "./routes/scoreRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", gameRoutes);
app.use("/api", scoreRoutes);
app.use("/api", destinationRoutes);

export default app;
