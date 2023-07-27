import { config } from "dotenv";
config();
import { Configuration, OpenAIApi } from "openai";
import { writeFile } from 'fs/promises';

const API_KEY = process.env.OPEN_AI_API_KEY;

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
  
  getGptResponse("How are you?");
