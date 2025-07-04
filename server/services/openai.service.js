import axios from "axios";
import { ApiError } from "../errors/ApiError.js";
import { getPromptMessages } from "../utils/openai.util.js";

const buildOpenAIUrl = () =>
    `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`;

export const getExplanation = async (code, language) => {
    try {
        const prompt = getPromptMessages("EXPLAINCODE", { code, language });
        const response = await axios.post(buildOpenAIUrl(),
            {
                messages: [prompt.system, prompt.user],
                temperature: 0.2,
                max_tokens: 6000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_OPENAI_KEY,
                },
            });

        if (response.status >= 200 && response.status < 300) {
            return response.data.choices[0].message.content;
        } else {
            console.error("OpenAI API error:", response.status, response.data);
            throw new ApiError(
                `OpenAI API returned status ${response.status}`,
                response.status
            );
        }

    } catch (e) {
        if (e instanceof ApiError) {
            throw e;
        }
        console.error("Unexpected error while getting explanation:", e);
        throw new ApiError("Failed to get explanation from OpenAI", 500);
    }
}

export const getMermaidFlowChartOutline = async (code, language) => {
    try {
        const prompt = getPromptMessages("GETFLOWCHARTCODE", { code, language });
        const response = await axios.post(buildOpenAIUrl(),
            {
                messages: [prompt.system, prompt.user],
                temperature: 0.1,
                max_tokens: 6000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_OPENAI_KEY,
                },
            });

        if (response.status >= 200 && response.status < 300) {
            console.log("OpenAi Response::\n" + response.data.choices[0].message.content);
            return extractJson(response.data.choices[0].message.content);
        } else {
            console.error("OpenAI API error:", response.status, response.data);
            throw new ApiError(
                `OpenAI API returned status ${response.status}`,
                response.status
            );
        }

    } catch (e) {
        if (e instanceof ApiError) {
            throw e;
        }
        console.error("Unexpected error while getting mermaid.js code outlines:", e);
        throw new ApiError("Failed to get mermaid.js outline from OpenAI", 500);
    }
}

const extractJson = (markdown) => {
    const match = markdown.match(/```json([\s\S]*?)```/);
    if (!match) throw new Error("Invalid JSON format in OpenAI response");
    return JSON.parse(match[1].trim());
};