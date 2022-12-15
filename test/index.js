const { blurhashFromURL } = require("../dist/index.js");

async function getBlurhash() {
  try {
    const output = await blurhashFromURL("https://i.imgur.com/NhfEdg2.png");
    console.log(output);
  } catch (error) {
    console.error(error.message);
  }
}

function getBlurhashPromise() {
  return new Promise((resolve, reject) => {
    blurhashFromURL("https://i.imgur.com/NhfEdg2.png")
      .then((output) => {
        console.log(output);
        resolve();
      })
      .catch((error) => {
        console.error(error.message);
        reject(error);
      });
  });
}

async function getBlurhashError() {
  try {
    const output = await blurhashFromURL("https://example.com");
    console.log(output);
  } catch (error) {
    console.error(error.message);
  }
}

getBlurhash();
getBlurhashPromise();
getBlurhashError();
