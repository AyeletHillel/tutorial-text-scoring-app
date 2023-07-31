import fs from 'fs';
import csv from 'csv-parser'

export const getData = async (filepath) => {
    return new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (row) => {
                rows.push([row["id"], row["text"]]);
                console.log(row)
            })
            .on('end', () => {
                const json = JSON.stringify(rows);
                resolve(json);
            })
            .on('error', (error) => {
                reject(error);
            });
    }); 
};

