#!/usr/bin/env node

/*
built on top of https://github.com/tmcw/bespoke

future ideas
- auto pull exif for date?
*/

const cp = require("child_process");
const fs = require("fs");
const util = require("util");
const prettyBytes = require("pretty-bytes");
const sharp = require("sharp");
const { getAverageColor } = require("fast-average-color-node");

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
  const prefix = `content/photos/${name}/${name}`;
  const inputBuffer = await readFile(file);

  await exec(`hugo new --kind photos photos/${name}`);

  const work = [];

  work.push(
    copyFile(file, `${prefix}_original.jpg`).then(async () => {
      console.log(`original ${prettyBytes(Buffer.byteLength(inputBuffer))}`);
    })
  );

  const image = sharp(inputBuffer);

  for (const format of ["jpg", "webp"]) {
    for (const res of [128, 640, 1280, 2880]) {
      const outputFilename = `${prefix}_${res}.${format}`;

      work.push(
        image
          .clone()
          .resize(res)
          .toFile(outputFilename)
          .then(async ({ size }) => {
            console.log(`${res}x ${format} ${prettyBytes(size)}`);
          })
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

      const [top, right, left, bottom, average] = await Promise.all([
        getAverageColor(
          await smallerImage
            .extract({
              top: 0,
              left: 0,
              width: info.width,
              height: sizeH,
            })
            .toBuffer()
        ),
        getAverageColor(
          await smallerImage
            .extract({
              top: 0,
              left: info.width - sizeW,
              width: sizeW,
              height: info.height,
            })
            .toBuffer()
        ),
        getAverageColor(
          await smallerImage
            .extract({
              top: 0,
              left: 0,
              width: sizeW,
              height: info.height,
            })
            .toBuffer()
        ),
        getAverageColor(
          await smallerImage
            .extract({
              top: info.height - sizeH,
              left: 0,
              width: info.width,
              height: sizeH,
            })
            .toBuffer()
        ),
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
      await writeFile(mdFilePath, contents, "utf8");
    })()
  );

  await Promise.all(work);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
