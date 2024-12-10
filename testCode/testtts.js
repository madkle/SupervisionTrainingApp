const fs = require('fs');
const path = require('path');
const OpenAI = require('openai/index.mjs');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure you set this in your environment
  });

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: "Today is a wonderful day to build something people love!",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

export default main();