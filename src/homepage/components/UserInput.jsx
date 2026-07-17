import "../styles/userInput.css";
import MindingButton from "./MindingButton";
import { useState } from "react";

export default function UserInput({ inputValue, setInputValue }) {
  const [draftValue, setDraftValue] = useState(inputValue);

  const handleMindingClick = () => {
    setInputValue(draftValue);
  };

  return (
    <div className="user-input-container">
      <textarea
        className="user-input"
        placeholder="What's happening?"
        value={draftValue}
        onChange={(e) => setDraftValue(e.target.value)}
      />

      <MindingButton onClick={handleMindingClick} />
    </div>
  );
}