import { generateSpeech } from "./textToSpeech.js";
export const handleAudioResponse = async (LlmResponse, voice) => {
    const audioBlob = await generateSpeech(LlmResponse, voice);

    const url = URL.createObjectURL(audioBlob);

    return url;
  };