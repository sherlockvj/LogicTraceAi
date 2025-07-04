import express from "express";
import { explainCode } from "../controllers/explain.controller.js";
import { generateFlowChart } from "../controllers/flowchart.controller.js";

const router = express.Router();

router.post("/explain-code", explainCode);
router.post("/generate-flowchart", generateFlowChart);

export default router;