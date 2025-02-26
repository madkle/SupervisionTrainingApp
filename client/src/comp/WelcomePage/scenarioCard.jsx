import { useContext } from "react";
import { Context } from "../../App.jsx";
const ScenarioCard = ({ avatar, scenario }) => {
  const InfoObject = useContext(Context);
  const [chosenScenario, setChosenScenario] = InfoObject.scenario;
  const isCardSelected = chosenScenario && chosenScenario.name === scenario.name;
  
  return (
    <>
      <div
        className={
          isCardSelected ? "scenarioCard cardSelected" : "scenarioCard"
        }
      >
        <div className="twoCol">
          <img src={avatar} className="avatarImage" alt="avatar image"></img>

          <div className=" avatarTextContainer">
            <div className="avatarTextRow ">
              <h2 className="">Navn: </h2>
              <p className="">{scenario.name || "No Data"}</p>
            </div>
            <div className="avatarTextRow">
              <h2>Personlighet</h2> <p>{scenario.personality || "No Data"}</p>
            </div>
            <div className="avatarTextRow">
              <h2>Alder</h2> <p>{scenario.age || "No Data"}</p>
            </div>
          </div>
        </div>
        <div className="avatarTextRow">
          <h2>Beskrivelse</h2> <p>{scenario.description || "No Data"}</p>
        </div>
        <button
          onClick={() => {
            setChosenScenario(scenario);
          }}
        >
          {!chosenScenario && isCardSelected ? "Senario Valgt" : "Velg Senario"}
        </button>
      </div>
    </>
  );
};

export default ScenarioCard;
