const Transcription = ({ response }) => {
  return (
    <div id="transcript-container">
      {response.map((item, index) => {
        if (item.role !== "system") {
          return (
            <div key={"chatline " + index} className={"chatLine " + item.role}>
              <div className="chatBubble">
                <span>{item.role === "user" ? "Veileder: " : "Lærling: "}</span>
                <span>{item.content}</span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Transcription;
