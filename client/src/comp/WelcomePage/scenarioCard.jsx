import { useContext } from "react";
import { Context } from "../../App.jsx";
const ScenarioCard = ({ avatar, scenario }) => {
  const InfoObject = useContext(Context);
  const [chosenScenario, setChosenScenario] = InfoObject.scenario;
  const isCardSelected =
    chosenScenario && chosenScenario.name === scenario.name;

  return (
    <>
      <div
        className={
          isCardSelected ? "scenarioCard cardSelected" : "scenarioCard"
        }
      >
        <div className="twoCol">
          <img src={avatar} className="avatarImage" alt="avatar image"></img>
          <div id="basicInfoGrid">
            <h2>Navn:</h2>
            <p>{scenario.name || "No Data"}</p>
            <h2>Personlighet:</h2>
            <p>{scenario.personality || "No Data"}</p>
            <h2>Alder:</h2>
            <p>{scenario.age || "No Data"}</p>
          </div>
        </div>
        <div id="scenarioDescrition">
          <h2>Beskrivelse</h2> <p>{scenario.description || "No Data"}</p>
        </div>
        {scenario.guidingQuestions.length !== 0 ? (
          <div id="scenarioTaskContainer">
            <h2>Veiledende spørsmål:</h2>
            <div id="questionContainer">
              {scenario.guidingQuestions.map((question, i) => {
                return (
                  <div key={"question: " + i} className="question">
                    <p>{`${i + 1}. ${question}`}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
        <br/>
        <button
          onClick={() => {
            setChosenScenario(scenario);
          }}
        >
          {!chosenScenario && isCardSelected ? "Case valgt" : "Velg case"}
        </button>
      </div>
    </>
  );
};

export default ScenarioCard;
