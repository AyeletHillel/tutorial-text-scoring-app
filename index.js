import { config } from "dotenv";
config();
import { Configuration, OpenAIApi } from "openai";
import { writeFile } from 'fs/promises';
import processWithRetry from "./retryOperation.js";
import { features } from './features.js';


const API_KEY = process.env.OPEN_AI_API_KEY;
const maxAttempts = 100;
const delay = 1000;

const openAi = new OpenAIApi(
    new Configuration({
      apiKey: API_KEY,
    })
  );

  const getGptResponse = async (prompt) => {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [{ role: "user", content: prompt }],
    });
    const generatedResponse = response.data.choices[0].message.content;
    console.log(generatedResponse);
  };
  
  const main = async (maxAttempts, delay) => {
    const result = await processWithRetry(() => getGptResponse("How are you?"), maxAttempts, delay);
    if (result) {
        const generatedResponse = result.data.choices[0].message.content;
        console.log(generatedResponse);
    }
};

main(maxAttempts, delay);

