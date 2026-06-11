document.addEventListener("DOMContentLoaded", () => {
  const textarea   = document.getElementById("dynamic-textarea");
  const windowCard = document.querySelector(".window-3d-card");
  const canvas     = windowCard ? windowCard.offsetParent : null;

  if (!textarea || !windowCard || !canvas) return;

  // --- 1. MULTI-AXIS EXPANSION ENGINE ---
  const matchContentSize = () => {
    textarea.style.width  = "40px";
    textarea.style.height = "auto";

    const targetWidth  = Math.max(160, textarea.scrollWidth + 24);
    const targetHeight = Math.max(48,  textarea.scrollHeight);

    textarea.style.width  = `${targetWidth}px`;
    textarea.style.height = `${targetHeight}px`;
  };

  matchContentSize();
  textarea.addEventListener("input", matchContentSize);

  // --- 2. RE-ARM FOCUS WHEN CLICKING ANYWHERE ON THE CARD ---
  windowCard.addEventListener("mousedown", (event) => {
    if (document.activeElement !== textarea) {
      event.preventDefault();
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  });

  // --- 3. ONE-SHOT MOVEMENT ENGINE ---
  canvas.addEventListener("mousedown", (event) => {
    // Ignore clicks inside own card
    if (windowCard.contains(event.target)) return;

    // Ignore clicks inside any other card on the canvas
    if (event.target.closest(".process-card, .window-3d-card")) return;

    // Only move if this card is the active one
    if (document.activeElement !== textarea) return;

    event.preventDefault();

    const canvasRect = canvas.getBoundingClientRect();
    const targetX    = event.clientX - canvasRect.left - (windowCard.offsetWidth  / 2);
    const targetY    = event.clientY - canvasRect.top  - (windowCard.offsetHeight / 2);

    windowCard.style.left = `${targetX}px`;
    windowCard.style.top  = `${targetY}px`;

    textarea.blur();
  });
});