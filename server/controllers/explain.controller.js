import { ApiError } from "../errors/ApiError.js";
import { getExplanation } from "../services/openai.service.js";


export const explainCode = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        if (!code) throw new ApiError("Code is required.", 400);

        const explanation = await getExplanation(code, language);
        res.status(200).json({ success: true, message: explanation });
    } catch (err) {
        next(err);
    }
}

