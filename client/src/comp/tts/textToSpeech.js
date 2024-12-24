export const generateSpeech = async (input, voice) => {
  try {
    const response = await fetch("http://localhost:5000/api/generate-speech", {
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
    /*
    // Create a URL for the Blob and trigger a download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "speech.mp3"; // Set the desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the Blob URL
    window.URL.revokeObjectURL(url);

    console.log("Speech file downloaded successfully!");
    */
  } catch (error) {
    console.error("Error generating speech:", error);
    alert("An error occurred while generating the speech.");
  } 
  
};
