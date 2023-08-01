// Import required modules
import fs from 'fs';
import csvParser from 'csv-parser'

const filePath = "./data/example-poetry-data.csv"

// Function to read the CSV file and convert it to a 2D array
export const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(Object.values(row));
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// (async () => {
//   try {
//     const responses = await readCSVFile(filePath);
//     console.log("data yata:", responses);
//     // You can now use the 'responses' variable as needed here or within any other code after this point.
//   } catch (error) {
//     console.log("Error reading the CSV file:", error);
//   }
// })();