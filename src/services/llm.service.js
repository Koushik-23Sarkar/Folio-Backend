import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);


function promptText(input){
  return `
  Analyze the emotion in the following journal entry.

Return JSON only in this format:

{
"emotion": "",
"keywords": [],
"summary": ""
}

Journal Entry:
"${input}"
  `
}

const analyzeEmotion = async (text) => {

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: promptText(text),
  });
  const geminiText = response.candidates[0].content.parts[0].text
  const cleanedText = geminiText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  const emotionData = JSON.parse(cleanedText);

  return emotionData;
};

export default analyzeEmotion;


// import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();







//   const prompt = `
// Analyze the emotion in the following journal entry.

// Return JSON only in this format:

// {
// "emotion": "",
// "keywords": [],
// "summary": ""
// }

// Journal Entry:
// "${text}"
// `;
