
const scenarios = {
    // Scenario for generating explanation 
    explainCode: {
        systemMessage: {
            role: "system",
            content: "You are an expert programming assistant. Your job is to explain code in a clear, structured, and concise manner. Follow this response format strictly:\n\n1. Overview: Briefly summarize what the code does.\n2. Explanation: Step-by-step logic based on the code.\n3. Usage: Where or how this code can be applied practically.\n\nOnly explain imported methods or classes if they are actually used in the code, and keep those explanations to one line each. Do not include the code in your response."
        }
        ,
        userMessage: ({ code, language }) => ({
            role: "user",
            content: `Explain the following ${language} code.

Follow this structure:
1. Overview – what this code is doing or trying to achieve.
2. Explanation – break down the logic clearly step-by-step.
3. Usage – how or where this code might be useful.

If any methods or classes are imported and used, include a one-liner explanation for each. Ignore unused imports.

Here is the code:

\`\`\`${language}
${code}
\`\`\``
        })
    }
}

/**
 * Gets the system and user messages for a given scenario
 * @param {string} scenario - Scenario key (e.g., "basicNewsTweet")
 * @param {object} params - Parameters like tone, stance, newsArticles, trends
 * @returns {{system: object, user: object}} - System and user message objects
 */
export const getPromptMessages = (scenario, params) => {
    const config = scenarios[scenario];
    if (!config) {
        throw new Error(`Unknown scenario: ${scenario}`);
    }

    return {
        system: config.systemMessage,
        user: config.userMessage(params),
    };
};