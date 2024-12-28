 import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOGGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateResult = async(prompt) =>{
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}
