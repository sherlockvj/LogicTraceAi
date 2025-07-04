import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

import { ApiError } from "../errors/ApiError.js";
import { getMermaidFlowChartOutline } from "./openai.service.js"


export const generateFlowChartUsingMermaidCode = async (code, language) => {
  // get the mermaid code to generate the flwochart
  const mermaidCodeForFlowChart = await getMermaidCodeForFlowchart(code, language);
  console.log("Successfully generated the mermaid code.")
  return { success: true, mermaidCode: mermaidCodeForFlowChart };
}

const getMermaidCodeForFlowchart = async (code, language) => {
  // STEP 1: Get the mermaid input from open ai
  const mermaidCode = await getMermaidFlowChartOutline(code, language);
  console.log("mermaid output::\n" + mermaidCode.code)
  if (!mermaidCode || !mermaidCode.code) {
    throw new ApiError("Invalid OpenAI Flowchart Response.", 500);
  }

  try {
    mermaidCode.code.replace(/\\n/g, "\n");
  } catch (e) {
    console.log("no new line")
  }

  return mermaidCode.code;
};

const generateFlowChartAndWriteToDisk = async (flowchartCode) => {
  const timestamp = Date.now();
  const flowImageDir = path.resolve("temp/flow_image");
  const errorImageDir = path.resolve("temp/error_image");

  ensureDirectory(flowImageDir);
  ensureDirectory(errorImageDir);

  const flowchartPath = path.join(flowImageDir, `flowchart_${timestamp}.png`);
  const errorImagePath = path.join(errorImageDir, `error_${timestamp}.png`);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setViewport({ width: 1600, height: 1200 });

  await page.setContent(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      background: white;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    #container {
      display: flex;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div id="container"></div>

  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';

    const code = \`${flowchartCode.replace(/`/g, "\\`")}\`;

    const renderChart = async () => {
      try {
        mermaid.initialize({ startOnLoad: false });
        const { svg } = await mermaid.render('theGraph', code);
        document.getElementById('container').innerHTML = svg;
        window.renderComplete = true;
      } catch (err) {
        console.error('Mermaid render error:', err);
        window.renderComplete = false;
      }
    };

    window.renderComplete = false;
    document.addEventListener("DOMContentLoaded", renderChart);
  </script>
</body>
</html>
`);

  try {
    await page.waitForFunction(() => window.renderComplete === true, { timeout: 10000 });
    await page.waitForSelector("#container svg", { timeout: 5000 });

    const svgElement = await page.$("#container svg");
    const box = await svgElement.boundingBox();

    if (!box || box.width === 0 || box.height === 0) {
      throw new Error("SVG has zero width/height");
    }

    await svgElement.screenshot({ path: flowchartPath });

    return { success: true, image: flowchartPath };

  } catch (error) {
    console.error("Failed to render flowchart:", error);
    await page.screenshot({ path: errorImagePath });

    if (process.env.NODE_ENV === "production") {
      fs.unlink(errorImagePath, () => { });
    }

    return { success: false, image: null };
  } finally {
    await browser.close();
  }
};

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};