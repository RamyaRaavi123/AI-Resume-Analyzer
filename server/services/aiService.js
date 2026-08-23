const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
].filter(Boolean);

const UNIQUE_MODELS = [...new Set(MODELS)];
const MAX_RETRIES = 2;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getClient = () => {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error('AI service not configured. Add GEMINI_API_KEY to server/.env');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const isRetryable = (error) => {
  const msg = String(error?.message || error).toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('404') ||
    msg.includes('quota') ||
    msg.includes('too many requests') ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('not found')
  );
};

const parseRetrySeconds = (error) => {
  const match = String(error?.message || '').match(/retry in ([\d.]+)s/i);
  return match ? Math.ceil(parseFloat(match[1])) : 2;
};

const friendlyError = (lastError) => {
  const msg = String(lastError?.message || lastError).toLowerCase();
  if (msg.includes('503') || msg.includes('high demand') || msg.includes('unavailable')) {
    return 'AI service is busy right now. Please wait a minute and try again.';
  }
  if (msg.includes('429') || msg.includes('quota')) {
    return 'AI quota reached. Wait a few minutes and try again.';
  }
  if (msg.includes('api key') || msg.includes('401') || msg.includes('403')) {
    return 'Invalid API key. Get a new key at https://aistudio.google.com/app/apikey';
  }
  if (msg.includes('404') || msg.includes('not found')) {
    return 'AI model unavailable. Restart the server and try again.';
  }
  return 'AI analysis failed. Please try again in a moment.';
};

const generateText = async (prompt) => {
  const client = getClient();
  let lastError;

  for (const modelName of UNIQUE_MODELS) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        if (isRetryable(error) && attempt < MAX_RETRIES) {
          const wait = parseRetrySeconds(error) + attempt * 2;
          console.warn(`Gemini ${modelName} failed (attempt ${attempt + 1}), retrying in ${wait}s...`);
          await sleep(wait * 1000);
          continue;
        }
        if (isRetryable(error)) {
          console.warn(`Gemini ${modelName} unavailable, trying next model...`);
          break;
        }
        throw new Error(friendlyError(error));
      }
    }
  }

  throw new Error(friendlyError(lastError));
};

const parseJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
  return null;
};

const analyzeResume = async (resumeText, targetRole = '') => {
  const prompt = `Analyze this resume for ATS compatibility and interview readiness.
Target role: ${targetRole || 'General Software Engineer'}

Resume:
${resumeText.slice(0, 4000)}

Respond ONLY with valid JSON:
{
  "atsScore": number (0-100),
  "skillGaps": ["gap1", "gap2"],
  "keywords": { "present": ["k1"], "missing": ["k2"] },
  "suggestions": ["s1", "s2"],
  "recommendedRoles": ["role1", "role2"],
  "strengths": ["s1"],
  "summary": "brief summary"
}`;

  const text = await generateText(prompt);
  return parseJSON(text) || {
    atsScore: 0,
    skillGaps: [],
    keywords: { present: [], missing: [] },
    suggestions: [text],
    recommendedRoles: [],
    strengths: [],
    summary: text,
  };
};

const generateInterviewQuestions = async (resumeText, role, difficulty, company = '') => {
  const prompt = `Generate 5 ${difficulty} interview questions for a ${role} position${company ? ` at ${company}` : ''}.
Based on resume: ${resumeText.slice(0, 2000)}

Respond ONLY with valid JSON:
{
  "questions": [{ "question": "...", "topic": "...", "tips": "..." }],
  "roadmap": [{ "topic": "...", "priority": "high|medium|low", "resources": ["..."] }]
}`;

  const text = await generateText(prompt);
  return parseJSON(text) || { questions: [], roadmap: [] };
};

const evaluateMockAnswer = async (question, answer, role) => {
  const prompt = `Evaluate this mock interview answer.
Role: ${role}
Question: ${question}
Answer: ${answer}

Respond ONLY with valid JSON:
{
  "communicationScore": number (0-100),
  "confidenceScore": number (0-100),
  "technicalScore": number (0-100),
  "overallScore": number (0-100),
  "feedback": "detailed feedback",
  "followUpQuestion": "next question based on answer"
}`;

  const text = await generateText(prompt);
  return parseJSON(text) || {
    communicationScore: 50,
    confidenceScore: 50,
    technicalScore: 50,
    overallScore: 50,
    feedback: text,
    followUpQuestion: '',
  };
};

const getCodingHint = async (problem, code, language) => {
  const prompt = `Give a helpful hint (NOT the full solution) for this coding problem.
Problem: ${problem}
Language: ${language}
Current code: ${code || 'none'}

Respond with a short hint only.`;
  return generateText(prompt);
};

const evaluateCode = async (problem, code, language) => {
  const prompt = `Evaluate this code solution.
Problem: ${problem}
Language: ${language}
Code: ${code}

Respond ONLY with valid JSON:
{
  "passed": boolean,
  "score": number (0-100),
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "feedback": "...",
  "hint": "optional hint if wrong"
}`;

  const text = await generateText(prompt);
  return parseJSON(text) || {
    passed: false,
    score: 0,
    timeComplexity: 'Unknown',
    spaceComplexity: 'Unknown',
    feedback: text,
  };
};

const chatAssistant = async (message, context = '') => {
  const prompt = `You are an expert interview preparation assistant. Help with interview questions, concepts, learning plans, and code review.
${context ? `Context: ${context}` : ''}

User: ${message}`;
  return generateText(prompt);
};

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  evaluateMockAnswer,
  getCodingHint,
  evaluateCode,
  chatAssistant,
};
