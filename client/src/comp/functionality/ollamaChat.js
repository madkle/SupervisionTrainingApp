export const character = {
  name: "Claude",
  age: 25,
  occupation: "student",
  workplace: "sykehjem",
  personality: "selvsikker og positiv",
};
export const exampleData = {
  norwegian: [
    {
      role: "system",
      content: `La oss spille et rollespill. Din karakter er ${character.name}, som er ${character.age} år gammel. Du er en ${character.personality} ${character.occupation} som har jobbet på et ${character.workplace} de siste to månedene. Du har kommet for sent til jobb de siste ukene og blir kalt inn til et møte med din veileder for å svare på noen spørsmål om din fravær. Du er nervøs og engstelig for møtet. Svar deretter. Snakk til meg som om jeg er veiledern din. Hvis du ikke vet svaret, bare si at du ikke vet.Du er norsk, svar med god norsk bokmål.`,
},
    {
      role: "assistant",
      content: "Hei... Hva ville du snakke om i dag?",
    },
  ],
  english: [
    {
      role: "system",
      content: `Lets roleplay. Your character is ${character.name}, who is ${character.age} years old. You are a ${character.personality} ${character.occupation} who has been coming late to work at the ${character.workplace} the past month. You are called into a supervision meeting with you supervisor to answer some questions about your absense. You are nervous and anxious about the meeting. answer accordingly. if you dont know the answer, just say you dont know.`,
    },
    {
      role: "assistant",
      content: "Hello... What would you like to talk about today?",
    },
  ],
};

export const callChatAPI = async (message, model) => {
  const response = await fetch(`/api/ollamaChat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ messageLog: message, model: model }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json(); // Process the entire response once received
  return data;
};
