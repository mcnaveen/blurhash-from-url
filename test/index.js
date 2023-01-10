const { blurhashFromURL } = require("../dist/index.js");

async function getBlurhash() {
  const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png", {
    size: 32,
  });
  console.log(output);
}

getBlurhash();
