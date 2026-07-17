import "../styles/mindingButton.css";
import mindingImage from '../../images/logo.gif';


export default function MindingButton({ onClick }) {
  return (
    <div
      className="minding-button"
      onClick={onClick}
    >
      <img src={mindingImage} alt="Minding" />
    </div>
  );
}