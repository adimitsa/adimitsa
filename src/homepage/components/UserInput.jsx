import "../styles/userInput.css";

export default function UserInput({ inputValue, setInputValue }) {
  return (
    <div className="user-input-container">
      <textarea
        className="user-input"
        placeholder="What's happening?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}