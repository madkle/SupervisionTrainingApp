export const generateSpeech = async (input, voice) => {
  try {
    const response = await fetch("http://localhost:5000/openai/tts", { // api/generate-speech
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({ input, voice }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    // Handle response as a Blob (binary data)
    const blob = await response.blob();

    return blob;
    
  } catch (error) {
    console.error("Error generating speech:", error);
    alert("An error occurred while generating the speech.");
  } 
  
};
