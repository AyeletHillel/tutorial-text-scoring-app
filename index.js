import { config } from "dotenv";
config();
import { Configuration, OpenAIApi } from "openai";
import processWithRetry from "./retryOperation.js";
import readCSVFile from "./getData.js";
import { features } from './features.js';
import saveResultsToCSVFile from "./saveResultsToCSV.js";


const API_KEY = process.env.OPEN_AI_API_KEY;
const maxAttempts = 10;
const delay = 1000;

const filePath = "./data/gpt-answers.csv";
const outputPath = "./result/gpt-results.csv";

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
    let featureDict = {}
    let textRatings = [text[0], text[1], featureDict];
    for (let feature of features) {
      const input = feature["prompt"] + "\n" + text[1];
  
      const generatedResponse = await processWithRetry(() => getGptResponse(input), maxAttempts, delay);
      if (generatedResponse) {
        featureDict[feature["name"]] = generatedResponse;
      };
    }
    console.log(textRatings);
    allRatings.push(textRatings);
  }
  // console.log(allRatings);

  saveResultsToCSVFile(allRatings, outputPath);
};

main(maxAttempts, delay);

