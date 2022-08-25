import blurhashFromURL from "../index.js";

async function getBlurhash() {
  console.log("Running test...");
  const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png");
  console.log(output);
}

getBlurhash();
