import { useState } from "react";

import ToolCard from "./ToolCard";
import UserInput from "./UserInput";

import "../styles/homepage.css";

import sysImage from '../../images/sys.png';

const TOOL_CARDS = [
  {
    id: "sys",
    name: "SYS",
    image: sysImage,
    route: "/sys",
  }
];

function allToolCardsRenderer(inputValue) {
  return TOOL_CARDS.map((tool) => (
    <ToolCard
      key={tool.id}
      props={{
        ...tool,
        userInput: inputValue,
      }}
    />
  ));
}

function userInputRenderer(inputValue, setInputValue) {
  return (
    <UserInput
      inputValue={inputValue}
      setInputValue={setInputValue}
    />
  );
}

function toolCardsContainerRenderer(inputValue) {
  const isInputEmpty = inputValue.trim() === "";
  return (
    <div
      className={`tool-cards-container ${
        isInputEmpty ? "disabled" : ""
      }`}
    >
      {allToolCardsRenderer(inputValue)}
    </div>
  );
}


export default function Homepage() {
  const [inputValue, setInputValue] = useState("");
  const isInputEmpty = inputValue.trim() === "";

  return (
    <div className="homepage">
        {toolCardsContainerRenderer(inputValue)}
        {userInputRenderer(inputValue, setInputValue)}
    </div>
  );
}