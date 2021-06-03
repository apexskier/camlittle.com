#!/usr/bin/env node

/*
Run this after building the site with hugo
*/

const cp = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");
const prettyBytes = require("pretty-bytes");
const sharp = require("sharp");
const S3 = require("aws-sdk/clients/s3");
const yaml = require("js-yaml");

const exec = util.promisify(cp.exec);
const readFile = util.promisify(fs.readFile);
const copyFile = util.promisify(fs.copyFile);
const writeFile = util.promisify(fs.writeFile);

const dryRun = process.argv.includes("--dry-run");

(async function () {
  const imageMeta = require(path.join(process.cwd(), "public/image_meta.json"));
  const imageSources = yaml.load(
    await readFile(path.join(process.cwd(), "data/imageSources.yml"), "utf8")
  );

  const s3 = new S3({
    endpoint: "sfo2.digitaloceanspaces.com",
    region: "sfo2",
  });

  async function objectExists(key) {
    return await new Promise((resolve, reject) => {
      s3.headObject(
        {
          Bucket: "camlittle-content",
          Key: key,
        },
        (err, data) => {
          if (err) {
            if (err.statusCode == 404) {
              resolve(false);
            } else {
              reject(err);
            }
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  const work = [];

  await Promise.all(
    imageMeta
      .filter((fileData) => fileData.media)
      .map((fileData) => fileData.media)
      .flat()
      .map((mediaData) =>
        (async () => {
          const parsedPermalink = path.parse(mediaData.rel_permalink);
          if (!mediaData.image_pipeline) {
            // not an image
            return;
          }

          const keyPrefix = `site-media${parsedPermalink.dir}/${parsedPermalink.name}_${mediaData.hash}`;
          const inputBuffer = await readFile(
            path.join(process.cwd(), "content", mediaData.filepath)
          );
          console.log(
            `original ${mediaData.filepath} ${prettyBytes(
              Buffer.byteLength(inputBuffer)
            )}`
          );
          const image = sharp(inputBuffer);

          for (const format of ["jpg", "webp"]) {
            for (const scale of [1, 2]) {
              for (const res of imageSources.widths) {
                // NOTE: "@" isn't supported in s3 key names
                const key = `${keyPrefix}_${res}x0at${scale}x.${format}`;
                const keyExists = await objectExists(key);
                if (keyExists) {
                  console.log(`already exists ${key}`);
                } else {
                  work.push(
                    (async () => {
                      let img = image.clone().resize(res).toFormat(format);
                      if (format == "jpg") {
                        img = img.jpeg({ progressive: true, quality: 90 });
                      }
                      const body = await img.toBuffer();
                      if (dryRun) {
                        console.log(`would upload ${key}`);
                      } else {
                        const data = await new Promise((resolve, reject) => {
                          s3.upload(
                            {
                              Key: key,
                              Body: body,
                              Bucket: "camlittle-content",
                              ACL: "public-read",
                            },
                            (err, data) => {
                              if (err) {
                                reject(err);
                              } else {
                                resolve(data);
                              }
                            }
                          );
                        });
                        console.log(`uploaded ${data.Key}`);
                      }
                    })()
                  );
                }
              }
            }
          }
        })()
      )
  );

  await Promise.all(work);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
