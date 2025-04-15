import React from "react";
const FeedbackDisplay = ({ response, scenario }) => {
  let data = "";
  if (response.constructor === "".constructor) {
    data = JSON.parse(response);
  } else if (response.constructor === {}.constructor) {
    data = response;
  } else {
    console.error("Invalid response format");
  }

  return data !== "" ? (
    <div className="feedbackContainer">
      <h2>Tilbakemelding samtale med {scenario.name}</h2>
      {/* Oppsummering */}
      <section>{data.oppsummering}</section>
      {/* Brukte metoder */}
      <section>
        <h3>Brukte metoder:</h3>
        <section className="metodeSection">
          {data.brukteMetoder.map((item, index) => {
            return (
              <div key={index} className="metodeContainer">
                <h4>{item.metode}</h4>
                <p className="metodeEksempel">"{item.eksempel}"</p>
                <p>{item.vurdering}</p>
              </div>
            );
          })}
        </section>
      </section>
      {/* styrker */}
      <section>
        <h3>Styrker:</h3>
        <ul>
          {data.styrker.map((item, index) => {
            return <li key={`styrke ${index}`}>{item}</li>;
          })}
        </ul>
      </section>

      {/* forbedringer */}
      <section>
        <h3>Forbedringer:</h3>
        <ul>
          {data.forbedringer.map((item, index) => {
            return <li key={`forbedring ${index}`}>{item}</li>;
          })}
        </ul>
      </section>

      {/* <h1>{data.title}</h1> 
      <p>{data.introduction}</p>

      <h2>Inkluderte teknikker:</h2>
      {data.techniques.map((technique, index) => (
        <p key={index}>
          <strong>{technique.name}:</strong> {technique.description}
        </p>
      ))}

      <h2>Begrensninger og utviklingsmuligheter:</h2>
      {data.limitations.map((limitation, index) => (
        <p key={index}>{limitation}</p>
      ))}

      <h2>Sammendrag:</h2>
      <p>{data.summary}</p>*/}
    </div>
  ) : (
    <></>
  );
};

export default FeedbackDisplay;
