import { writeFile } from 'fs/promises';
import { features } from "./features.js";

const saveResultsToCSVFile = async (results, outputPath) => {
    let csvContent = "ID, Text, " + features.map(feature => feature.name).join(", ") + "\n";
  
    for (let row of results) {
      const [id, text, scoresDict] = row;
      const scoresArray = Object.entries(scoresDict).map(([_, value]) => `${value}`);
      const scoresString = scoresArray.join(", ");
      csvContent+= `${id}, "${text}", ${scoresString}\n`;
    }
  
    try {
      await writeFile(outputPath, csvContent);
      console.log('CSV file saved successfully.');
    } catch (err) {
      console.error('Error saving CSV file:', err);
    }
  };

export default saveResultsToCSVFile;