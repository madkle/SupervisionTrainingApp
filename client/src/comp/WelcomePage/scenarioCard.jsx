import { useContext } from "react";
import { Context } from "../../App.jsx";
const ScenarioCard = ({ avatar, name, personality, description }) => {
  const InfoObject = useContext(Context);
  const [chosenScenario, setChosenScenario] = InfoObject.scenario;
  const isCardSelected = chosenScenario === name;
  return (
    <>
      <div
        className={
          isCardSelected ? "scenarioCard cardSelected" : "scenarioCard"
        }
      >
        <img src={avatar} className="avatarImage" alt="avatar image"></img>
        <div className=" avatarTextContainer">
          <div className="avatarTextRow ">
            <h2 className="">Navn: </h2>
            <p className="">{name || "No Data"}</p>
          </div>
          <div className="avatarTextRow">
            <h2>Personlighet</h2> <p>{personality || "No Data"}</p>
          </div>
          <div className="avatarTextRow">
            <h2>Beskrivelse</h2> <p>{description || "No Data"}</p>
          </div>
          <button
            onClick={() => {
              setChosenScenario(name);
            }}
          >
            {!chosenScenario && isCardSelected
              ? "Senario Valgt"
              : "Velg Senario"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ScenarioCard;