const { blurhashFromURL } = require("../dist/cjs/index.js");

async function getBlurhash() {
  const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png");
  console.log(output);
}

getBlurhash();
