import { useState, useRef } from "react";

import ToolCard from "./ToolCard";
import UserInput from "./UserInput";

import "../styles/homepage.css";

import sysImage from "../../images/sys.png";

const TOOL_CARDS = [
  {
    id: "sys",
    name: "SYS",
    image: sysImage,
    route: "/sys",
  }
];

function allToolCardsRenderer(inputValue, onToolClick) {
  return TOOL_CARDS.map((tool) => (
    <ToolCard
      key={tool.id}
      props={{
        ...tool,
        userInput: inputValue,
        onToolClick,
      }}
    />
  ));
}
function userInputRenderer(
  inputValue,
  setInputValue,
  inputRef,
  onMindingClick
) {
  return (
    <UserInput
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
      onMindingClick={onMindingClick}
    />
  );
}

function toolCardsContainerRenderer(
  inputValue,
  toolsFocused,
  onToolClick
) {
  const isInputEmpty = inputValue.trim() === "";

  return (
<div
  className={`tool-cards-container ${
    isInputEmpty || !toolsFocused ? "disabled" : ""
  }`}
>
      {allToolCardsRenderer(inputValue, onToolClick)}
    </div>
  );
}


export default function Homepage() {
  const [inputValue, setInputValue] = useState("");
  const [toolsFocused, setToolsFocused] = useState(false);

  const inputRef = useRef(null);

  const handleMindingClick = () => {
    setToolsFocused(true);
  };

const handleToolClick = () => {
  setToolsFocused(false);

  setTimeout(() => {
    inputRef.current?.focus();
  }, 0);
};

  return (
    <div className="homepage">

      {toolCardsContainerRenderer(
        inputValue,
        toolsFocused,
        handleToolClick
      )}

      {userInputRenderer(
        inputValue,
        setInputValue,
        inputRef,
        handleMindingClick
      )}

    </div>
  );
}