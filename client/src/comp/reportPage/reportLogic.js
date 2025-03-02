export const useReportLogic = (props) => {
  const callOllamaFeedback = async (log) => {
    const response = await fetch(`http://localhost:5000/ollama/report`, {// api/ollamaGenerate
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }, 
      body: JSON.stringify({ chatLog: log }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json(); // Process the entire response once received
    return data.content;
  };

  return { callOllamaFeedback };
};
export const exampleEvaluation =
  '{\n  "title": "Veiledningssamtale med lærling",\n  "introduction": "I denne rapporten har veilederen og lærlingen gått gjennom en samtale for å identifisere utfordringer og arbeide fremover.",\n  "techniques": [\n    {\n      "name": "Aktiv listening",\n      "description": "Veilederen lytter aktivt til lærlingens uttrykkelser og reflekterer hva de tror lærlingen mener."\n    },\n    {\n      "name": "Empatisk forståelse",\n      "description": "Veilederen forsøker å forstå lærlingens perspektiv og følelser, spesielt når det gjelder åpningen om å være usikker på hvordan å ta hånd om tid og oppgaver."\n    },\n    {\n      "name": "Åpen spørsmålsteknikk",\n      "description": "Veilederen bruker åpne spørsmål for å stimulere lærlingens refleksjon over utfordringene de møter, for eksempel \'Hvordan har du tatt deg god tid i jobben?\'"\n    },\n    {\n      "name": "Refleksjon og erkjennelse av egne styrker og svakheter",\n      "description": "Lærlingen reflekterer over sine egne styrker og svakheter, for eksempel at de har vært god til å jobbe på enkelte oppdrag men også dårlig til å sette prioriteringer og planlegge seg selv."\n    }\n  ],\n  "limitations": [\n    "Tiden til samtalen var nok, og det kunne ha vært bra med flere detaljer om hvordan lærlingen ønsker å arbeide fremover.",\n    "Veilederen hadde ikke noe skisse eller liste over mål for hva som skulle dekkas i samtalen."\n  ],\n  "summary": "Samtalen inneholdt gode eksempler på aktive veiledningsmetoder og teknikker, inkludert aktiv lytting, empatisk forståelse, åpen spørsmålsteknikk og refleksjon over egne styrker og svakheter. En tilbakemelding ville være en god idé, da det ikke var noe skisse eller liste over mål på hva som skulle dekkas i samtalen."\n}';
export const exampleChatLog = [
  {
    role: "system",
    content:
      "Du er Asbjørn, en 18 år gammel lærling som har vært ansatt på arbeidsplassen i 3 måneder. Selv om du er en hyggelig og positiv person, har du hatt 15 % fravær fra arbeidsplassen. Dette skyldes dels at du kommer for sent, og dels at du ikke alltid gir beskjed når du er borte. Du ligger også på etterskudd med opplæringsplanen og har en tendens til å utsette avtalte oppgaver. Jeg er veilederen din, og vi skal ha en samtale for å forstå hva som gjør situasjonen utfordrende for deg, og finne måter vi kan hjelpe deg til å komme på rett spor. Fortell hvordan du opplever situasjonen og hva du tror kan hjelpe.",
  },
  { role: "user", content: "Hei, hvordan går det med deg?" },
  {
    role: "assistant",
    content:
      "Hei! Det går okay, jeg trodde bare at jeg hadde godt nok avgang fra lærlingerperiode så langt. Men nå har du sagt at jeg ligger bak etter noen måneder, og jeg tenker også over hvorfor jeg ofte kommer for sent eller ikke er på jobb når jeg skal være der. Jeg er en type som helst gjerne åpne opp om jeg kan, men jeg tror nesten bare det nå, siden du har sagt dette.\n\nJeg har hatt litt god tid i jobben, jeg elsker å jobbe her og med kollegene. Men jeg har også vært veldig streng mot meg selv når det gjelder tidligere for sent innkallinger eller enkelte avtale som er blitt utsett igjen...",
  },
  {
    role: "user",
    content:
      "Så bra du liker å jobbe her. På hvilken måte har du tatt deg god tid i jobben?",
  },
  {
    role: "assistant",
    content:
      "Jeg liker virksomheten, og jeg tror det er en bra sted å lære og utvikle meg selv som arbeidspersonale. Jeg har fått tilbud om forskjellige oppdrag som jeg har vært glad for å være med på. Jeg har også hatt god kontakt med noen av kollegene, vi snakker mye om det enkelte og hjelper hverandre godt når vi trenger det.\n\nMen også noen ting som er litt usikre eller ukjente for meg etter 3 måneder på jobb...",
  },
  {
    role: "user",
    content: "Jeg skjønner, Hva slags ting er du usikker på?",
  },
  {
    role: "assistant",
    content:
      "Det ene jeg er usikker på er egentlig hvordan jeg skal få alt under kontroll når det gjelder tid og oppgaver. Jeg har vært litt dårlig til å sette prioriteringer og planlegge meg selv, så noen ganger har jeg kommet for sent eller glemt en del av oppdragene hjemme.\n\nJeg tror også at jeg noen ganger slipper opp på jobben ved å løse små oppgaver i stedet for det store bildet. Jeg vet at jeg må bli bedre til å se hvordan alle de forskjellige deloppgavene skal være sammen og hvordan de skal gå fremover.\n\nSvært god ting er imidlertid at du kommer overfor meg om hva som er en utfordring, det er et stort pluspunkt ved denne læreperioden.",
  },
];
