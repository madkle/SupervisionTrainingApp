import React from "react";
const Evaluation = ({ response }) => {
  let data = "";
  if (response !== "") {
    if (response.constructor === ({}).constructor) {
      data = response
    }else {
      data = JSON.parse(response);
    }
    
  }

  return data !== "" ? (
    <div>
      <h1>{data.title}</h1>
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
      <p>{data.summary}</p>
    </div>
  ) : (
    <></>
  );
};

export default Evaluation;
