import { generateSpeech } from "./textToSpeech.js";
export const handleAudioResponse = async (LlmResponse) => {
    const audioBlob = await generateSpeech(LlmResponse, "ash");

    const url = URL.createObjectURL(audioBlob);

    return url;
  };