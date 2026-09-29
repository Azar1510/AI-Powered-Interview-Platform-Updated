import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../reactjs/dist");

const app = express();

// ✅ Security check
if (!process.env.NVIDIA_API_KEY) {
  console.error("❌ Missing NVIDIA_API_KEY in .env");
  process.exit(1);
}

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString(), model: MODEL_NAME });
});

// ✅ OpenAI-compatible client (NVIDIA endpoint)
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL_NAME = process.env.MODEL_NAME || "meta/llama-3.2-11b-vision-instruct";

/* ─────────────────────────────
   GENERATE QUESTIONS
───────────────────────────── */
app.post("/api/generate", async (req, res) => {
  const { role, level, techstack } = req.body;

  if (!role || !level || !techstack || !Array.isArray(techstack) || techstack.length === 0) {
    return res.status(400).json({ error: "Missing required fields (role, level, techstack)" });
  }

  try {
    const prompt = `
      You are a senior FAANG-level interviewer.
      Generate 5 HIGHLY SPECIFIC, scenario-based interview questions for a ${role} (${level} level).
      Tech stack: ${techstack.join(", ")}.
      
      Return ONLY a JSON array of strings. Do not include any intro or outro text.
      Example: ["Question 1", "Question 2"]
    `;

    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    
    // 💡 IMPROVED PARSING: Find the first '[' and last ']'
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]") + 1;

    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonString = content.slice(jsonStart, jsonEnd);
      try {
        const questions = JSON.parse(jsonString);
        return res.json({ questions });
      } catch (parseError) {
        console.error("JSON Parse Failed. Raw content:", content);
      }
    }

    // Fallback: split by line if JSON fails, but strip numbers
    const fallback = content
      .split("\n")
      .filter(q => q.trim() && q.length > 10)
      .map(q => q.replace(/^\d+\.\s*/, "").replace(/[\[\]"]/g, "").trim());
    
    res.json({ questions: fallback.slice(0, 5) });
  } catch (error) {
    console.error("🔥 Generation Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: error.message || "Failed to generate questions" });
  }
});

/* ─────────────────────────────
   EVALUATE ANSWERS
───────────────────────────── */
app.post("/api/evaluate", async (req, res) => {
  const { role, level, techstack, questions, answers } = req.body;

  // ✅ Validation
  if (!role || !level || !questions || !answers) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate answers.

Return ONLY valid JSON:
{
  "results": [
    {
      "question": "...",
      "answer": "...",
      "score": number (0-10),
      "feedback": "...",
      "strengths": "...",
      "improvements": "..."
    }
  ],
  "overall_feedback": "...",
  "overall_score": number (0-10)
}

Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Answers:
${answers.map((a, i) => `${i + 1}. ${a || "No answer"}`).join("\n")}
`;

    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    let raw = response.choices[0].message.content;

    // ✅ Clean output and extract JSON object
    raw = raw.replace(/```json|```/g, "").trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      raw = raw.slice(jsonStart, jsonEnd);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("❌ Evaluation JSON parse failed. Raw content:", raw);
      return res.status(500).json({
        error: "Invalid JSON returned from AI",
        raw,
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error("🔥 Evaluation Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: error.message || "Evaluation failed" });
  }
});

/* ─────────────────────────────
   GENERATE ROADMAP
───────────────────────────── */
app.post("/api/roadmap", async (req, res) => {
  const { role, level, techstack } = req.body;

  if (!role || !techstack) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const prompt = `
You are a senior engineering mentor.

Create a structured learning roadmap.

Return ONLY valid JSON:
{
  "title": "...",
  "description": "...",
  "sections": [
    {
      "title": "...",
      "nodes": [
        {
          "label": "...",
          "description": "...",
          "priority": "essential" | "important" | "optional" | "bonus"
        }
      ]
    }
  ]
}

Role: ${role}
Level: ${level}
Tech stack: ${Array.isArray(techstack) ? techstack.join(", ") : techstack}

Rules:
- 5-7 sections
- 4-6 topics per section
- Keep labels short
- Make it practical
`;

    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 2000,
    });

    let raw = response.choices[0].message.content;

    // Clean JSON and extract JSON object
    raw = raw.replace(/```json|```/g, "").trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      raw = raw.slice(jsonStart, jsonEnd);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Roadmap JSON parse failed:", raw);
      return res.status(500).json({ error: "Invalid JSON from AI", raw });
    }

    res.json(parsed);

  } catch (error) {
    console.error("🔥 Roadmap Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap" });
  }
});

// ✅ Serve static Frontend files in Production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(distPath, "index.html"));
    }
    next();
  });
}

/* ─────────────────────────────
   START SERVER
───────────────────────────── */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT} (0.0.0.0:${PORT})`);
});