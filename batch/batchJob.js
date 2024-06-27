const { downloadCorpCodeXML } = require("./downloadCorpCodeXML");
const { combineData } = require("./makeOgongCorpListJSON");
const { handleError } = require("./error/errorHandler");
const { downloadKopi200ListCSV } = require("./downloadKopi200ListCSV");
const { convertCsvToJson } = require("./convertKospi200ListCSVIntoJSON");
const { configureOgongDetailCSV } = require("./configureOgongDetailData");
const { configureOgongDataCSV } = require("./configureOgongData");
const { upsertOgongDataToMongo } = require("./upsertOgongDB");
const { upsertOgongDetailDataToMongo } = require("./upsertOgongDetailDB");

async function runBatchJob() {
  try {
    await downloadKopi200ListCSV();
    await convertCsvToJson();
    await downloadCorpCodeXML();
    await combineData();
    await configureOgongDetailCSV();
    await configureOgongDataCSV();
    await upsertOgongDataToMongo();
    await upsertOgongDetailDataToMongo();
  } catch (err) {
    handleError(err);
  }
}

module.exports = { runBatchJob };
