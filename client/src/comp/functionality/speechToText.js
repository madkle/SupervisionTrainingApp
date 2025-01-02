export const handleSpeechToText = async (audioBlob, model) => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm"); // Append the audio blob with a filename
    formData.append("model", model);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    const data = await response.json();
    console.log(data.transcription);
    return data.transcription;
  } catch (error) {
    console.error("Error generating speech:", error);
    alert("An error occurred while generating the speech.");
  }
};