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
    </div>
  ) : (
    <></>
  );
};

export default FeedbackDisplay;
