const { google } = require("googleapis");
const parser = require("./parser");
const createReadStream = require("fs").createReadStream;
const {
  resultFile,
  driveClientId,
  driveClientSecret,
  driveRedirectUri,
  driveRefreshToken,
} = require("./constants");

const client = new google.auth.OAuth2(
  driveClientId,
  driveClientSecret,
  driveRedirectUri
);
client.setCredentials({ refresh_token: driveRefreshToken });

const csvToJson = ()=>{


async function createAndUploadFile(auth) {
  await parser();
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.create({
    requestBody: {
      name: resultFile,
      mimeType: "application/json",
    },
    media: {
      mimeType: "application/json",
      body: createReadStream(resultFile),
    },
  });
  if (response.status === 400) {
    console.log("error creating file", response.errors);
  }
}

createAndUploadFile(client).catch(console.error);

}

module.exports = csvToJson;
