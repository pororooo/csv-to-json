const dotenv = require("dotenv");
const Transform = require("stream").Transform;
const createReadStream = require("fs").createReadStream;
const createWriteStream = require("fs").createWriteStream;
const { google } = require("googleapis");

const sourceFile = process.argv[3];
const resultFile = process.argv[5];
const separator = process.argv[7];

dotenv.config();

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
const readStream = createReadStream("../assets/" + sourceFile);
const writeStream = createWriteStream("../assets/" + resultFile);

const csvToJson = () => {
  return new Promise((resolve) => {
    const result = [];

    const createObject = (headers, line) => {
      let item = {};
      for (let j = 0; j < headers.length; j++) {
        const propertyName = headers[j];
        const value = line[j];
        item[propertyName] = value;
      }
      return item;
    };

    const transform = new Transform({
      transform(chunk, encoding, callback) {
        const str = chunk.toString();
        const lines = str.split("\r1/");
        const headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
          let currentLine = lines[i].split(separator || ",");
          result.push(createObject(headers, currentLine));
        }
        const json = JSON.stringify(result)
          .replaceAll(",", ",\n")
          .replaceAll('"}', '"\n}')
          .replaceAll("{", "{\n")
          .replaceAll("[", "[\n");

        callback(null, json);
      },
    });

    writeStream.on("finish", () => resolve());
    readStream.pipe(transform).pipe(writeStream);
  });
};

async function createAndUploadFile(auth) {
  await csvToJson();
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.create({
    requestBody: {
      name: resultFile,
      mimeType: "application/json",
    },
    media: {
      mimeType: "application/json",
      body: createReadStream("../assets/" + resultFile),
    },
  });
  if (response.status === 400) {
    console.log("error creating file", response.errors);
  }
}

createAndUploadFile(client).catch(console.error);
