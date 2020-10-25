#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const util = require("util");
const sharp = require("sharp");
const hsluv = require("hsluv");
const { createCanvas, loadImage } = require("canvas");
const { getAverageColor } = require("fast-average-color-node");

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

if (process.argv.length !== 3) {
  console.error(`usage: ${process.argv[1]} photosDir`);
  process.exit(1);
}

const [, , photosDir] = process.argv;

function colorSorter(a, b) {
  return a.color[0] - b.color[0];
}

function pack(num, width, height) {
  const ratio = width / height;
  const columns = Math.floor(Math.sqrt(num * ratio));
  const rows = Math.floor(columns / ratio);

  const size = Math.floor(width / columns);
  return { size, rows, columns };
}

(async function () {
  console.log("Starting");

  const photoPaths = await readDir(photosDir);
  const { size, rows, columns } = pack(photoPaths.length, 6000, 3000);
  const photoPromises = photoPaths
    .map(async (file) => {
      const photoPath = path.join(photosDir, file);
      try {
        const buffer = await sharp(await readFile(photoPath))
          .resize({ width: size, height: size, fit: "cover" })
          .toBuffer();
        const color = hsluv.hexToHsluv((await getAverageColor(buffer)).hex);
        return { buffer, color, photoPath };
      } catch (err) {
        console.warn(`error for ${photoPath}`);
        console.warn(err);
        return null;
      }
    });
  const photos = (await Promise.all(photoPromises)).filter((data) => !!data);
  photos.sort(colorSorter);

  console.log("Processed photos");

  const canvas = createCanvas(columns * size, rows * size);
  const ctx = canvas.getContext("2d");

  console.log("Generating output");

  // a bus error will happen if I pass the whole thing into sharp's composite

  await Promise.all(
    photos.map(async ({ buffer, color }, i) => {
      // rainbow top to bottom
      // const pos = {
      //   top: (i % columns) * size,
      //   left: Math.floor(i / columns) * size
      // };

      // rainbow left to right
      const pos = {
        top: Math.floor(i / rows) * size,
        left: (i % rows) * size,
      };

      // ctx.fillStyle = hsluv.hsluvToHex(color);
      // ctx.fillRect(pos.top, pos.left, size, size);

      ctx.drawImage(await loadImage(buffer), pos.top, pos.left, size, size);
    })
  );

  await new Promise((resolve) => {
    const out = fs.createWriteStream("./mosaic.jpg");
    const stream = canvas.createJPEGStream({
      quality: 0.95,
      chromaSubsampling: false,
    });
    stream.pipe(out);
    out.on("finish", () => {
      console.log("The JPEG file was created.");
      resolve();
    });
  });
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
