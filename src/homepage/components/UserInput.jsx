import "../styles/userInput.css";
import MindingButton from "./MindingButton";
import { useEffect } from "react";

export default function UserInput({
  inputValue,
  setInputValue,
  inputRef,
  onMindingClick
}) {
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="user-input-container">

      <textarea
        ref={inputRef}
        className="user-input"
        placeholder="What's happening?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <MindingButton onClick={onMindingClick} />

    </div>
  );
}