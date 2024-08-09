const { blurhashFromURL } = require("../dist/index.js");
const assert = require('assert').strict;

async function runTests() {
  console.log("Running Blurhash tests...\n");

  // Test remote image
  await testRemoteImage();

  // Test local image
  await testLocalImage();

  // Test invalid URL
  await testInvalidURL();

  // Test invalid local path
  await testInvalidLocalPath();

  console.log("\nAll tests completed.");
}

async function testRemoteImage() {
  try {
    const output = await blurhashFromURL("https://images.unsplash.com/photo-1545769743-16f354c6262b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", {
      size: 32,
    });
    console.log("\n✅ Remote Image Blurhash:");
    console.log(output);
    assert(output.encoded, "Remote image should have an encoded blurhash");
    assert(output.width > 0, "Remote image should have a positive width");
    assert(output.height > 0, "Remote image should have a positive height");
  } catch (error) {
    console.error("❌ Remote image test failed:", error.message);
  }
}

async function testLocalImage() {
  try {
    const output = await blurhashFromURL("./image/cover.png", {
      size: 32,
      offline: true,
    });
    console.log("\n✅ Local Image Blurhash:");
    console.log(output);
    assert(output.encoded, "Local image should have an encoded blurhash");
    assert(output.width > 0, "Local image should have a positive width");
    assert(output.height > 0, "Local image should have a positive height");
  } catch (error) {
    console.error("❌ Local image test failed:", error.message);
  }
}

async function testInvalidURL() {
  try {
    await blurhashFromURL("https://invalid-url.com/non-existent-image.jpg");
    console.error("❌ Invalid URL test should have thrown an error");
  } catch (error) {
    console.log("✅ Invalid URL test passed (error thrown as expected)");
  }
}

async function testInvalidLocalPath() {
  try {
    await blurhashFromURL("./non-existent-image.png", { offline: true });
    console.error("❌ Invalid local path test should have thrown an error");
  } catch (error) {
    console.log("✅ Invalid local path test passed (error thrown as expected)");
  }
}

runTests().catch(console.error);