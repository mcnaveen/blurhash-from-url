const { blurhashFromURL } = require("../dist/index.js");

/* Remote Image */
async function getRemoteBlurhash() {
  const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png", {
    size: 32,
    offline: true,
  });
  console.log("\n 🪄 Remote Image Blurhash\n");
  console.log(output);
  console.log("\n");
}

getRemoteBlurhash();

/* Local Image */
async function getLocalBlurhash() {
  const output = await blurhashFromURL("./image/cover.png", {
    size: 32,
    offline: true,
  });
  console.log("\n 🪄 Local Image Blurhash\n");
  console.log(output);
}

getLocalBlurhash();
