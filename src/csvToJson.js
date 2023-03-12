const Transform = require("stream").Transform;
const createReadStream = require("fs").createReadStream;
const { google } = require("googleapis");
const { resultFile, sourceFile, separator, client } = require("./constants");

const readStream = createReadStream(sourceFile);

const result = [];
let data = [];

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
    data += chunk;
    const str = data.toString();
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

readStream.pipe(transform);

async function createAndUploadFile(auth) {
  const driveService = google.drive({ version: "v3", auth });
  const response = await driveService.files.create({
    requestBody: {
      name: resultFile,
      mimeType: "application/json",
    },
    media: {
      mimeType: "application/json",
      body: transform,
    },
  });
  if (response.status === 400) {
    console.log("error creating file", response.errors);
  }
}
createAndUploadFile(client).catch(console.error);
