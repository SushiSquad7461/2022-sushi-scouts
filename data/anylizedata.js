const ObjectsToCsv = require("objects-to-csv");
const data = require("./matchdata.json");
const outputFileName = "./data/matchdata.csv";

/**
 * This function converts json to csv file
 */
async function convertToCSV() {
  const csv = new ObjectsToCsv(data.matchData);
  await csv.toDisk(outputFileName);
}

module.exports = convertToCSV;
