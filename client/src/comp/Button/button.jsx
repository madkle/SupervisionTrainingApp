import React, { useState } from "react";

const ToggleButton = ({trueState, falseState}) => {
    
    const [toggle, setButton] = useState(false);
      const changeState = () => {
        setButton(!toggle);
      };
  return (
    <>
     <button onClick={changeState}>{!toggle ? trueState.text : falseState.text}</button>
     {!toggle ? trueState.component : falseState.component}
    </>
  );
};
export default ToggleButton;
