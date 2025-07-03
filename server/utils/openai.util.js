
const scenarios = {

    EXPLAINCODE: {
        systemMessage: {
            role: "system",
            content: "You are an expert programming assistant. Your job is to explain code in a clear, structured, and concise manner. Follow this response format strictly:\n\n1. Overview: Briefly summarize what the code does.\n2. Explanation: Step-by-step logic based on the code.\n3. Usage: Where or how this code can be applied practically.\n\nOnly explain imported methods or classes if they are actually used in the code, and keep those explanations to one line each. Do not include the code in your response."
        },
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
    },

    GETFLOWCHARTCODE: {
        systemMessage: {
            role: "system",
            content: `You are an expert in code analysis and flowchart generation. Given a piece of code, your job is to analyze its structure and return structured data in JSON format that can be used to create a Mermaid.js flowchart.

Your response must:
- Identify Start and End points.
- Detect functions and function calls.
- Identify conditionals (if, else, switch).
- Identify loops (for, while).
- Include return statements.

Return only a JSON object containing:
- 'nodes': a list of labeled flowchart blocks.
- 'connections': a list of links between blocks.

Do not include Mermaid.js code, text explanations, or extra formatting. Only valid, parsable JSON should be returned.`
        },
        userMessage: ({ code, language }) => ({
            role: "user",
            content: `Analyze the following ${language} code and return its flowchart structure in JSON format.

Follow this structure strictly:
1. Identify flowchart elements as "nodes" (e.g., start, function, condition, return, end).
2. Connect them using "connections" with directional flow.
3. Label conditions (like Yes/No) clearly.
4. Only include used parts of the code. Ignore unused declarations.

Output format:
\`\`\`json
{
  "nodes": [ ... ],
  "connections": [ ... ]
}
\`\`\`

Do NOT include code, explanations, or any other text.

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