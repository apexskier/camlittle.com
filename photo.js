#!/usr/bin/env node

/*
built on top of https://github.com/tmcw/bespoke

name format should be 2006-01-02-url-slug
*/

const cp = require("child_process");
const fs = require("fs");
const util = require("util");
const prettyBytes = require("pretty-bytes");
const sharp = require("sharp");
const { getAverageColor } = require("fast-average-color-node");
const S3 = require("aws-sdk/clients/s3");
const exif = require("exif-js");

const exec = util.promisify(cp.exec);
const readFile = util.promisify(fs.readFile);
const copyFile = util.promisify(fs.copyFile);
const writeFile = util.promisify(fs.writeFile);

if (process.argv.length !== 4) {
  console.error(`usage: ${process.argv[1]} file.jpg name`);
  process.exit(1);
}

const [, , file, name] = process.argv;

(async function () {
  const profile = "digitalocean";

  const s3 = new S3({
    endpoint: "sfo2.digitaloceanspaces.com",
    profile,
  });

  const filePrefix = `content/photos/${name}/${name}`;
  const inputBuffer = await readFile(file);

  await exec(`hugo new --kind photos photos/${name}`);

  const work = [];

  work.push(
    copyFile(file, `${filePrefix}_original.jpg`).then(async () => {
      const data = await new Promise((resolve, reject) => {
        s3.upload(
          {
            Key: `photos/${name}_original.jpg`,
            Body: inputBuffer,
            Bucket: "camlittle-content",
            ACL: "public-read",
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          },
        );
      });
      console.log(
        `original ${prettyBytes(Buffer.byteLength(inputBuffer))} → ${
          data.Location
        }`,
      );
    }),
  );

  const image = sharp(inputBuffer);

  for (const format of ["jpg", "webp"]) {
    for (const res of [128, 640, 1280, 2880]) {
      const outputFilename = `${filePrefix}_${res}.${format}`;

      work.push(
        (async () => {
          const sizedImage = image.clone().resize(res);
          const [{ size }, data] = await Promise.all([
            sizedImage.clone().toFile(outputFilename),
            (async () => {
              const data = await sizedImage.clone().toBuffer();
              return new Promise((resolve, reject) => {
                s3.upload(
                  {
                    Key: `photos/${name}_${res}.${format}`,
                    Body: data,
                    Bucket: "camlittle-content",
                    ACL: "public-read",
                  },
                  (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(data);
                    }
                  },
                );
              });
            })(),
          ]);
          console.log(
            `${res}x ${format} ${prettyBytes(size)} → ${data.Location}`,
          );
        })(),
      );
    }
  }

  work.push(
    (async () => {
      const smallerImage = image.clone().resize(256);
      const { data, info } = await smallerImage.toBuffer({
        resolveWithObject: true,
      });
      const sizeH = Math.round(info.height / 8);
      const sizeW = Math.round(info.width / 8);

      async function getAverageColorOfRegion(region) {
        return getAverageColor(await smallerImage.extract(region).toBuffer());
      }

      const [top, right, left, bottom, average] = await Promise.all([
        getAverageColorOfRegion({
          top: 0,
          left: 0,
          width: info.width,
          height: sizeH,
        }),
        getAverageColorOfRegion({
          top: 0,
          left: info.width - sizeW,
          width: sizeW,
          height: info.height,
        }),
        getAverageColorOfRegion({
          top: 0,
          left: 0,
          width: sizeW,
          height: info.height,
        }),
        getAverageColorOfRegion({
          top: info.height - sizeH,
          left: 0,
          width: info.width,
          height: sizeH,
        }),
        getAverageColor(data),
      ]);

      const mdFilePath = `content/photos/${name}/index.md`;
      let contents = await readFile(mdFilePath, "utf8");

      const colorValues = { top, right, left, bottom, average };
      const parts = [`color:`];
      for (const key in colorValues) {
        parts.push(`  ${key}: '${colorValues[key].hex}'`);
      }

      contents = contents.replace(`COLOR_INFO:`, parts.join("\n"));

      try {
        const arrayBuffer = inputBuffer.buffer.slice(
          inputBuffer.byteOffset,
          inputBuffer.byteOffset + inputBuffer.byteLength,
        );
        const exifData = exif.readFromBinaryFile(arrayBuffer);
        if (exifData && exifData.DateTimeOriginal) {
          // exif DateTimeOriginal format: "YYYY:MM:DD HH:MM:SS"
          const exifDate = exifData.DateTimeOriginal.split(" ")
            .map((v, i) => {
              if (i === 0) {
                return v.replace(/:/g, "-");
              }
              return v;
            })
            .join("T");
          const captureDate = new Date(exifDate).toISOString();
          contents = contents.replace(
            `captureDate: `,
            `captureDate: ${captureDate}`,
          );
        }
      } catch (e) {
        console.warn("Could not extract EXIF date:", e);
      }

      await writeFile(mdFilePath, contents, "utf8");
    })(),
  );

  await Promise.all(work);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
