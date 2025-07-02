import express from "express";
import { explainCode } from "../controllers/explain.controller.js";

const router = express.Router();

router.post("/explain-code", explainCode);

export default router;