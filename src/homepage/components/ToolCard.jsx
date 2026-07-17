import "../styles/toolCard.css";

export default function ToolCard({ props }) {
  const openTool = () => {
    window.open(
      `${window.location.origin}${props.route}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      id={props.id}
      className="tool-card"
      onClick={openTool}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          openTool();
        }
      }}
    >
      <img
        src={props.image}
        alt={props.name}
        className="tool-card-image"
      />
      <h3 className="tool-card-name">{props.name}</h3>
    </div>
  );
}