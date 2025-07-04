import { generateFlowChartUsingMermaidCode } from "../services/flowchart.service.js";
import { ApiError } from "../errors/ApiError.js";

export const generateFlowChart = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        if (!code) throw new ApiError("Code is required.", 400);

        const flowChartServiceResponse = await generateFlowChartUsingMermaidCode(code, language);

        if (!flowChartServiceResponse.success || !flowChartServiceResponse.mermaidCode) {
            throw new ApiError("Failed to generate flowchart", 500);
        }

        res.status(200).json(flowChartServiceResponse);

    } catch (err) {
        next(err instanceof ApiError ? err : new ApiError("Internal Server Error", 500));
    }
}