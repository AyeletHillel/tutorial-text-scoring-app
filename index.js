import { config } from "dotenv";
config();
import { Configuration, OpenAIApi } from "openai";
import processWithRetry from "./retryOperation.js";
import { readCSVFile } from "./getData.js";
import { features } from './features.js';


const API_KEY = process.env.OPEN_AI_API_KEY;
const maxAttempts = 10;
const delay = 1000;

const filePath = "./data/example-poetry-data.csv"

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: API_KEY,
  })
);

const getGptResponse = async (prompt) => {
  const response = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "user", content: prompt },
    ],
  });
  const generatedResponse = response.data.choices[0].message.content;
  // console.log(generatedResponse);
  return generatedResponse; 
};
  
const main = async (maxAttempts, delay) => {
  const texts = await readCSVFile(filePath);

  let allRatings = []

  for (let text of texts) {
    let textRatings = [text[0], text[1]];
    for (let feature of features) {
      const input = feature["prompt"] + "\n" + text[1];
  
      const generatedResponse = await processWithRetry(() => getGptResponse(input), maxAttempts, delay);
      if (generatedResponse) {
        textRatings.push(generatedResponse);
      };
    }
    // console.log(textRatings);
    allRatings.push(textRatings);
  }
  console.log(allRatings)

  
};

main(maxAttempts, delay);

