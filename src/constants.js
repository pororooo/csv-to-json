const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const sourceFile = process.argv[3];
const resultFile = process.argv[5];
const separator = process.argv[7];

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const client = new google.auth.OAuth2(
  driveClientId,
  driveClientSecret,
  driveRedirectUri
);
client.setCredentials({ refresh_token: driveRefreshToken });


module.exports = {
  client,
  sourceFile,
  resultFile,
  separator,
  driveClientId,
  driveClientSecret,
  driveRedirectUri,
  driveRefreshToken,
};
