const Transform = require("stream").Transform;
const createReadStream = require("fs").createReadStream;
const createWriteStream = require("fs").createWriteStream;
const { sourceFile, resultFile, separator } = require("./constants");

const readStream = createReadStream(sourceFile);
const writeStream = createWriteStream(resultFile);

const parser = () => {
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

module.exports = parser;
