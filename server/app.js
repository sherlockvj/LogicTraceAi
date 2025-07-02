import express from "express"
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import explainRoutes from "./routes/explain.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// health check API
app.get("/api/status", (_, res) => res.status(200).json({"status": "success", "message": "API is healthy"}));

app.use("/api/explain", explainRoutes);

app.use(errorHandler);

export default app;