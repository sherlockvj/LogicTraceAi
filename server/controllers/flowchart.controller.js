import fs from "fs";
import { generateFlowChartUsingMermaidCode } from "../services/flowchart.service.js";
import { ApiError } from "../errors/ApiError.js";

export const generateFlowChart = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        if (!code) throw new ApiError("Code is required.", 400);

        const flowChartServiceResponse = await generateFlowChartUsingMermaidCode(code, language);

        if (!flowChartServiceResponse.success || !flowChartServiceResponse.image) {
            throw new ApiError("Failed to generate flowchart", 500);
        }

        const imagePath = flowChartServiceResponse.image;

        if (!fs.existsSync(imagePath))
            throw new ApiError("Image not found.", 500);

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        if (process.env.NODE_ENV === "production") {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Failed to delete image after reading:", err);
                } else {
                    console.log("Image deleted after reading.");
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "data:image/png;base64," + base64Image,
        });

    } catch (err) {
        next(err instanceof ApiError ? err : new ApiError("Internal Server Error", 500));
    }
}